<template>
  <div>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>aqqqq
        </button>
          <a class="navbar-brand" href="#">Project name</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Help</a></li>
          </ul>
          <form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search...">
          </form>
        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
          <ul class="nav nav-sidebar">
            <nuxt-link to="/" exact active-class="active"  tag="li"><a>Home</a></nuxt-link>
            <nuxt-link to="/about" active-class="active"  tag="li"><a>About</a></nuxt-link>
            <nuxt-link to="/myvuetable" active-class="active"  tag="li"><a>myvuetable</a></nuxt-link>
          </ul>

          <ul class="nav nav-sidebar">
            <nuxt-link to="/elm/alert" exact active-class="active"  tag="li"><a>alert</a></nuxt-link>
            <nuxt-link to="/about" active-class="active"  tag="li"><a>About</a></nuxt-link>
            <nuxt-link to="/myvuetable" active-class="active"  tag="li"><a>myvuetable</a></nuxt-link>
          </ul>


        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <!-- <button @click="$store.commit('increment')">{{ $store.state.counter }}</button>-->
          <nuxt/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>


</script>

<style scoped>

</style>
