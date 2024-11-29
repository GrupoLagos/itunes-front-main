import api from './api';

// Función para obtener las canciones de una banda
export const listbyband = async (band) => {
  try {
    const response = await api.get(`/search_tracks?name=${band}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener canciones:', error)
    throw error
  }
}

// Función para guardar una canción como favorita
export const saveFavorite = async (favoriteData) => {
  try {
    const response = await api.post('/favoritos', favoriteData)
    return response.data
  } catch (error) {
    console.error('Error al guardar la canción favorita:', error)
    throw error
  }
}

// Listar mis 5 canciones favoritas
export const misfavoritos = async () => {
  try {
    const response = await api.get('/misfavoritos')
    return response.data
  } catch (error) {
    console.error('Error al obtener mis canciones favoritas:', error)
    throw error
  }
}
