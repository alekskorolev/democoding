<template>
  <header class="">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">AK</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMenu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/about" class="nav-link" active-class="active" exact-active-class="active" aria-current="page" href="#">About</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about/2" class="nav-link" active-class="active" exact-active-class="active" aria-current="page" href="#">About2</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
        <!--router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <a target="_blank" href="https://hh.ru/resume/04735775ff096fd0900039ed1f74476a63676c?print=true">Print Resume</a-->
      </div>
    </nav>
  </header>
</template>

<style lang="scss">
header {
  position: fixed;
  width: 100%;
  & ~ * {
    padding-top: 70px;
  }
  .navbar {
    padding: 10px 30px;
  }
}
</style>