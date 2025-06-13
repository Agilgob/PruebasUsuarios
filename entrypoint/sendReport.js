import { readFile } from 'fs/promises';
import { WebClient } from '@slack/web-api';

/**
 * Sube un archivo a Slack usando uploadV2
 * @param {Object} options
 * @param {string} options.token - Slack Bot Token
 * @param {string} options.filePath - Ruta del archivo
 * @param {string} options.fileName - Nombre que tendrá en Slack
 * @param {string} options.channelId - Canal destino (ID)
 * @param {string} options.message - Mensaje inicial
 * @returns {Promise<Object>} - Respuesta de Slack
 */
async function uploadFileToSlack({ token, filePath, fileName, channelId, message }) {
  const client = new WebClient(token);
  const fileBuffer = await readFile(filePath);

  return client.files.uploadV2({
    channel_id: channelId,
    initial_comment: message,
    file: fileBuffer,
    filename: fileName,
  });
}



// Variables sensibles tomadas del entorno
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const FILE_NAME = process.env.REPORT_FILENAME;

const MESSAGE = "Aquí está el reporte actualizado";

try {
  const response = await uploadFileToSlack({
    token: SLACK_TOKEN,
    filePath: FILE_NAME,
    fileName: FILE_NAME,
    channelId: SLACK_CHANNEL,
    message: MESSAGE,
  });

  console.log("✅ Archivo subido:", response);
} catch (err) {
  console.error("❌ Error subiendo archivo:", err);
}
