import express from 'express';
import cors from 'cors'; // Importe o pacote cors
import { createLogger, format, transports } from 'winston';
import { consultarPlaca } from './consulta.js'; // Certifique-se de usar o caminho correto

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'consulta-fipe.log' })
    ]
});

const app = express();
const port = process.env.PORT || 3000;

// Ative o CORS para todas as rotas
app.use(cors());

app.get('/consulta/:placa', async (req, res) => {
    const placa = req.params.placa;
    logger.info(`Consulta recebida para a placa: ${placa}`);

    try {
        const resultado = await consultarPlaca(placa);

        if (resultado && !resultado.error) {
            logger.info(`Consulta bem-sucedida para a placa: ${placa}`);
            res.status(200).json({
                status: 'success',
                dados: resultado
            });
        } else {
            logger.warn(`Nenhum dado encontrado para a placa: ${placa}`);
            res.status(404).json({
                status: 'error',
                message: 'Placa não encontrada ou inválida.'
            });
        }
    } catch (error) {
        logger.error(`Erro ao consultar a placa ${placa}: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao consultar a placa.'
        });
    }
});

app.listen(port, () => {
    logger.info(`Servidor rodando na porta ${port}`);
});
