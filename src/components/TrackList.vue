<template>
  <div class="container mt-5 p-4 shadow bg-light rounded">
    <!-- Título -->
    <h1 class="text-center mb-4 text-primary">Búsqueda de Canciones de Banda</h1>

    <!-- Contenedor centrado para el input y el botón -->
    <div class="input-group mb-4 w-75 mx-auto">
      <input
        v-model="bandName"
        class="form-control"
        type="text"
        placeholder="Ingrese nombre de la banda"
        @keyup.enter="buscarCanciones"
      />
      <button @click="buscarCanciones" class="btn btn-primary">Buscar</button>
    </div>

    <!-- Totales de álbumes y canciones -->
    <div v-if="totalAlbumes || totalCanciones" class="text-center mb-4">
      <p class="mb-1"><strong>Total álbumes:</strong> {{ totalAlbumes }}</p>
      <p class="mb-1"><strong>Total canciones:</strong> {{ totalCanciones }}</p>
    </div>

    <!-- Mostrar la tabla solo si hay canciones -->
    <div v-if="canciones.length > 0" class="table-responsive rounded shadow-sm p-3 bg-white">
      <h2 class="text-center text-secondary mb-4">Resultados de Búsqueda</h2>
      <table class="table table-striped table-hover">
        <thead class="bg-primary text-white">
          <tr>
            <th scope="col">Nombre Canción</th>
            <th scope="col">Nombre Álbum</th>
            <th scope="col">Escuchar</th>
            <th scope="col">Precio</th>
            <th scope="col">Fecha de Lanzamiento</th>
            <th scope="col">Favorita</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cancion in canciones" :key="cancion.cancion_id">
            <td>{{ cancion.nombre_tema }}</td>
            <td>{{ cancion.nombre_album }}</td>
            <td>
              <!-- Reproductor de audio para escuchar la canción -->
              <audio :src="cancion.preview_url" controls preload="none"></audio>
            </td>
            <td>{{ cancion.precio.valor }} {{ cancion.precio.moneda }}</td>
            <td>{{ formatearFecha(cancion.fecha_lanzamiento) }}</td>
            <td>
              <button class="btn btn-outline-danger" @click="agregarAFavoritos(cancion)">
                ❤️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Listado de favoritos -->
    <div v-if="canciones.length>0" class="table-responsive rounded shadow-sm p-3 bg-white mt-5">
      <h2 class="text-center text-secondary mb-4">🎵❤️ Mis canciones favoritas ❤️🎵</h2>
      <table class="table table-striped table-hover">
        <thead class="bg-success text-white">
          <tr>
            <th scope="col">Nombre Canción</th>
            <th scope="col">Nombre Banda</th>
            <th scope="col">Ranking</th>
            <th scope="col">Usuario</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="favorito in favoritos" :key="favorito.cancion_id">
            <td>{{ favorito.nombre_tema }}</td>
            <td>{{ favorito.nombre_banda }}</td>
            <td>{{ favorito.ranking }}</td>
            <td>{{ favorito.usuario }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { listbyband, saveFavorite, misfavoritos } from "../services/tracks"

export default {
  data() {
    return {
      bandName: "",
      canciones: [],
      totalAlbumes: 0,
      totalCanciones: 0,
      favoritos: []
    };
  },
  mounted() {
    this.obtenerFavoritos();
  },
  methods: {
    formatearFecha(fecha) {
      const options = { year: "numeric", month: "long", day: "numeric" }
      const date = new Date(fecha)
      return new Intl.DateTimeFormat("es-ES", options).format(date)
    },
    async buscarCanciones() {
      if (this.bandName.trim() === "") {
        alert("Por favor, ingresa el nombre de la banda.")
        return
      }

      try {
        const response = await listbyband(this.bandName)
        this.canciones = response.canciones || []
        this.totalAlbumes = response.total_albumes || 0
        this.totalCanciones = response.total_canciones || 0
      } catch (error) {
        alert("Ocurrió un error al buscar las canciones. Inténtalo de nuevo.")
      }
    },
    async agregarAFavoritos(cancion) {
      const favoriteData = {
        nombre_banda: this.bandName,
        cancion_id: cancion.cancion_id,
        usuario: "Ana",
        ranking: "5/5", //Se incrementa automaticamente por back
      }
      try {
        const respuesta = await saveFavorite(favoriteData);
        if(respuesta) {
          alert(`¡${cancion.nombre_tema} fue añadida a tus favoritos!`)
          location.reload()
        }
      } catch (error) {
        alert(error.response.data.error)
      }
    },
    async obtenerFavoritos() {
      try {
        const response = await misfavoritos()
        this.favoritos = response.favoritos || []
      } catch (error) {
        alert("Ocurrió un error al obtener las canciones favoritas.")
      }
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 2.5rem;
}

.container {
  max-width: 1200px;
}

.input-group {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Espacio en las tablas */
.table {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
}

thead {
  position: sticky;
  top: 0;
}

/* Espacio entre filas */
.table td,
.table th {
  padding: 1rem;
  text-align: center;
}

/* Tamaño del reproductor */
audio {
  width: 100%;
}

/* Separación entre las tablas */
.table-responsive {
  margin-bottom: 2rem;
}
</style>
