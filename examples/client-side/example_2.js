const Hapi = require('@hapi/hapi');

// Создаем сервер на порту 3000
const server = Hapi.server({
    host: 'localhost',
    port: 3000
});

// При запуске сервера создаем ложную дату последней модификации файла
const lastModified = new Date(); 

// Создаем несколько простых роутов для теста
server.route({
    method: 'GET',
    // Тут заложим роут / и /n где n не обязательный, любой, параметр
    path: '/{n?}',
    handler: function (request, h) {
        // Генерируем случайное число, по нему мы визуально поймем, поменялся ли контент на веб странице.
        const randomNum = Math.random();
        // Выводим число в консоль сервера, просто чтобы понять, происходил ли вызов handler
        console.log('randomNum: ', randomNum);

        // Создаем HTML контент с двумя перекрестными ссылками.
        const content = `
            <p>${  Math.random(randomNum) }</p>
            <a href="/"> Главная страница </a>
            <br/>
            <a href="/2"> Страница 2 </a>
        `

        // Создаем объект ответа.
        const response = h.response(content);

        // Добавляем заголовок последней модификации ресурса.
        response.header('Expires', 'Sat, 1 Oct 2050 01:00:00 GMT');

        // Добавляем в заголовок только одну опцию и ни слова про время жизни кеша.
        // response.header('Cache-Control', 'public');
    
        return response;
    },
    options: {
        cache: false // отключение кэширования
    }
});

server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, h) {
        const content = 'Это страница hello.';
        const response = h.response(content);

        // Добавляем заголовок последней модификации ресурса.
        response.header('Expires', 'Sat, 1 Oct 2050 01:00:00 GMT');

        // Добавляем в заголовок только одну опцию и ни слова про время жизни кеша.
        // response.header('Cache-Control', 'public');

        return response;
    },
    options: {
        cache: false // отключение кэширования
    }
});

// Запускаем сервер
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Сервер запущен по адресу:', server.info.uri);
}

start();

