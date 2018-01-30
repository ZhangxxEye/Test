import { get as objGet, each, isFunction,isNil, isString, isArray } from "lodash";
import validators from "./validators";
import { slugifyFormID } from "./schema";

function convertValidator(validator) {
	if (isString(validator)) {
		if (validators[validator] != null)
			return validators[validator];
		else {
			console.warn(`'${validator}' is not a validator function!`);
			return null; // caller need to handle null
		}
	}
	return validator;
}

export default {
	props: [
		"model",
		"schema",
		"formOptions",
		"disabled",
    "value"
	],

	data() {
		return {
			errors: []
		};
	},

	computed: {
	  computedValue() {
      let val;
        val = this.value;
      if (isFunction(this.formatValueToField))
        val = this.formatValueToField(val);

      return val;
    }
		/*value: {
			cache: false,
			get() {
				let val;
				// if (isFunction(this.schema.get)&&this.model)
				// 	val = this.schema.get(this.model);
				if (this.schema && this.schema.value)
					val = this.schema.value;

				if (isFunction(this.formatValueToField))
					val = this.formatValueToField(val);

				return val;
			},

			set(newValue) {
				let oldValue = this.value;

			/!*	if (isFunction(this.formatValueToModel))
					newValue = this.formatValueToModel(newValue);*!/

				let changed = false;
				if (isFunction(this.schema.set)) {
					this.schema.set(this.model, newValue);
					changed = true;
				} else if (this.schema.model) {
					// this.setModelValueByPath(this.schema.model, newValue);
					changed = true;
				}

				if (changed) {
					this.$emit("model-updated", newValue, this.schema.model);

					if (isFunction(this.schema.onChanged)) {
						this.schema.onChanged.call(this, this.model, newValue, oldValue, this.schema);
					}

					if (this.$parent.options && this.$parent.options.validateAfterChanged === true){
						this.validate();
					}
				}
			}
		}*/
	},

	watch: {

  },
	methods: {
    onInput (event) {

      this.$emit('input', event.target.value)
    },
		validate(calledParent) {
			this.clearValidationErrors();

			if (this.schema.validator && this.schema.readonly !== true && this.disabled !== true) {

				let validators = [];
				if (!isArray(this.schema.validator)) {
					validators.push(convertValidator(this.schema.validator).bind(this));
				} else {
					each(this.schema.validator, (validator) => {
						validators.push(convertValidator(validator).bind(this));
					});
				}

				each(validators, (validator) => {
					let addErrors = err => {
						if (isArray(err))
							Array.prototype.push.apply(this.errors, err);
						else if (isString(err))
							this.errors.push(err);
					};

					let res = validator(this.value, this.schema, this.model);
					if (res && isFunction(res.then)) {
						// It is a Promise, async validator
						res.then(err => {
							if (err) {
								addErrors(err);
								let isValid = this.errors.length == 0;
								this.$emit("validated", isValid, this.errors, this);
							}
						});
					} else {
						if (res)
							addErrors(res);
					}
				});

			}

			if (isFunction(this.schema.onValidated)) {
				this.schema.onValidated.call(this, this.model, this.errors, this.schema);
			}

			let isValid = this.errors.length == 0;
			if (!calledParent)
				this.$emit("validated", isValid, this.errors, this);

			return this.errors;
		},

		clearValidationErrors() {
			this.errors.splice(0);
		},

		setModelValueByPath(path, value) {
			// convert array indexes to properties
			let s = path.replace(/\[(\w+)\]/g, ".$1");

			// strip a leading dot
			s = s.replace(/^\./, "");

			let o = this.model;
			const a = s.split(".");
			let i = 0;
			const n = a.length;
			while (i < n) {
				let k = a[i];
				if (i < n - 1)
					if (o[k] !== undefined) {
						// Found parent property. Step in
						o = o[k];
					} else {
						// Create missing property (new level)
						this.$root.$set(o, k, {});
						o = o[k];
					}
				else {
					// Set final property value
					this.$root.$set(o, k, value);
					return;
				}

				++i;
			}
		},

		getFieldID(schema) {
			const idPrefix = this.formOptions && this.formOptions.fieldIdPrefix ? this.formOptions.fieldIdPrefix : "";
			return slugifyFormID(schema, idPrefix);
		},

// Get style classes of field
    getFieldRowClasses(field) {
      const hasErrors = this.fieldErrors(field).length > 0;
      let baseClasses = {
        error: hasErrors,
        disabled: this.fieldDisabled(field),
        readonly: this.fieldReadonly(field),
        featured: this.fieldFeatured(field),
        required: this.fieldRequired(field)
      };

      let {validationErrorClass, validationSuccessClass} = this.options;
      if (validationErrorClass && validationSuccessClass) {
        if (hasErrors) {
          baseClasses[validationErrorClass] = true;
          baseClasses.error = false;
        }
        else {
          baseClasses[validationSuccessClass] = true;
        }
      }

      if (isArray(field.styleClasses)) {
        each(field.styleClasses, (c) => baseClasses[c] = true);
      }
      else if (isString(field.styleClasses)) {
        baseClasses[field.styleClasses] = true;
      }

      baseClasses["field-" + field.type] = true;

      return baseClasses;
    },

    // Get type of field 'field-xxx'. It'll be the name of HTML element
    getFieldType(fieldSchema) {
      return "field-" + fieldSchema.type;
    },

    // Should field type have a label?
    fieldTypeHasLabel(field) {
      let relevantType = "";
      if (field.type === "input") {
        relevantType = field.inputType;
      } else {
        relevantType = field.type;
      }

      switch (relevantType) {
        case "button":
        case "submit":
        case "reset":
          return false;
        default:
          return true;
      }
    },

    // Get disabled attr of field
    fieldDisabled(field) {
      if (isFunction(field.disabled))
        return field.disabled.call(this, this.model, field, this);

      if (isNil(field.disabled))
        return false;

      return field.disabled;
    },

    // Get required prop of field
    fieldRequired(field) {
      if (isFunction(field.required))
        return field.required.call(this, this.model, field, this);

      if (isNil(field.required))
        return false;

      return field.required;
    },

    // Get visible prop of field
    fieldVisible(field) {
      if (isFunction(field.visible))
        return field.visible.call(this, this.model, field, this);

      if (isNil(field.visible))
        return true;

      return field.visible;
    },

    // Get readonly prop of field
    fieldReadonly(field) {
      if (isFunction(field.readonly))
        return field.readonly.call(this, this.model, field, this);

      if (isNil(field.readonly))
        return false;

      return field.readonly;
    },

    // Get featured prop of field
    fieldFeatured(field) {
      if (isFunction(field.featured))
        return field.featured.call(this, this.model, field, this);

      if (isNil(field.featured))
        return false;

      return field.featured;
    },

    buttonClickHandler(btn, field, event) {
      return btn.onclick.call(this, this.model, field, event, this);
    },

    // Child field executed validation
    onFieldValidated(res, errors, field) {
      // Remove old errors for this field
      this.errors = this.errors.filter(e => e.field != field.schema);

      if (!res && errors && errors.length > 0) {
        // Add errors with this field
        errors.forEach((err) => {
          this.errors.push({
            field: field.schema,
            error: err
          });
        });
      }

      let isValid = this.errors.length == 0;
      this.$emit("validated", isValid, this.errors);
    },

    // Validating the model properties
    validate() {
      this.clearValidationErrors();

      this.$children.forEach((child) => {
        if (isFunction(child.validate)) {
          let errors = child.validate(true);
          errors.forEach((err) => {
            this.errors.push({
              field: child.schema,
              error: err
            });
          });
        }
      });

      let isValid = this.errors.length == 0;
      this.$emit("validated", isValid, this.errors);
      return isValid;
    },

    // Clear validation errors
    clearValidationErrors() {
      this.errors.splice(0);

      each(this.$children, (child) => {
        child.clearValidationErrors();
      });
    },

    modelUpdated(newVal, schema){
      this.$emit("model-updated", newVal, schema);
    },

    buttonVisibility(field) {
      return field.buttons && field.buttons.length > 0;
    },

    fieldErrors(field) {
      let res = this.errors.filter(e => e.field == field);
      return res.map(item => item.error);
    },

    getFieldID(schema) {
      const idPrefix = this.options && this.options.fieldIdPrefix ? this.options.fieldIdPrefix : "";
      return slugifyFormID(schema, idPrefix);
    }
	}
};
