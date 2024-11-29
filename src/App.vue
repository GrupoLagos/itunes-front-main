<template>
  <div id="app">
    <TrackList />  <!-- Mostrar el componente aquí -->
  </div>
</template>

<script>
import TrackList from './components/TrackList.vue';  // Importa el componente TrackList

export default {
  name: 'App',
  components: {
    TrackList  // Registra el componente en la sección de componentes
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>