import envConfig from './env-config.json';

export const environment = {
  production: false,
  apiHost: envConfig.host_api,
  buscaPetsLocalizacaoDefault: {
    lat: envConfig.busca_pet_localizacao_lat,
    lng: envConfig.busca_pet_localizacao_lng,
  },
  mapsKey: envConfig.maps_key,
  firebaseApiKey: envConfig.firebase_api_key,
  firebaseAuthDomain: envConfig.firebase_auth_domain,
  firebaseProjectId: envConfig.firebase_project_id,
  firebaseStorageBucket: envConfig.firebase_storage_bucket,
  firebaseMessagingSenderId: envConfig.firebase_messaging_sender_id,
  firebaseAppId: envConfig.firebase_app_id,
  firebaseMeasurementId: envConfig.firebase_measurement_id
};