**Описание проекта**

Проект представляет собой клиентское приложение для управления покупками и продажей косметических предметов игры CS2. Приложение использует API [https://market-old.csgo.com/docs-v2](https://market-old.csgo.com/docs-v2) для взаимодействия с маркетплейсом.

**Технологии, использованные в проекте:**

- **React**: библиотека для построения пользовательских интерфейсов.
- **Redux Toolkit (RTK)**: для управления состоянием приложения.
- **RTK Query**: для упрощения работы с API и асинхронными запросами.
- **TypeScript**: Типизация кода.
- **Flowbite**: библиотека компонентов на основе Tailwind CSS.

**Функциональность:**

- Подключение к WebSocket для получения обновлений о новых товарах в реальном времени.
- Управление и настройка цен на предметы.
- Управление лимитами на цены.
- Автоматическое обновление цен в зависимости от текущих условий рынка.
- Поддержка ручного и автоматического режима обновления цен.
- Отображение цен и текущих предложений на рынке.

Приложение обеспечивает удобный интерфейс для пользователей, позволяя им эффективно управлять своим инвентарем и быстро реагировать на изменения рынка косметических предметов для игры CS2.
## Превью

[![страница продажи](https://i.ibb.co/64Qz2Rt/preview-image.png)](https://ibb.co/64Qz2Rt)


## Установка и запуск

- `npm install` - установка зависимостей
- в constants.ts необходимо прописать собственные данные(API key, access token) 
- `npm run start` - запуск

## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner

## Inspiration

- [Create React App](https://github.com/facebook/create-react-app/tree/main/packages/cra-template)
- [Vite](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react)
- [Vitest](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib)
