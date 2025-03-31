import express from 'express';
import router from './routes/routes';

const app = express();

const PORT = process.env.PORT ?? 3000;

app.disable("x-powered-by");

// Middleware para parsear json
app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h1>Hola Mundo!</h1>");
});

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
}); 