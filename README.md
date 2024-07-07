**Описание проекта**

Проект представляет собой клиентское приложение для управления покупками и продажей косметических предметов игры CS2. Приложение использует API [market.csgo.com](https://market.csgo.com/api/v2/) для взаимодействия с маркетплейсом.

**Технологии, использованные в проекте:**

- **React**: библиотека для построения пользовательских интерфейсов.
- **Redux Toolkit (RTK)**: для управления состоянием приложения.
- **RTK Query**: для упрощения работы с API и асинхронными запросами.
- **Flowbite**: библиотека компонентов на основе Tailwind CSS для создания стильного и отзывчивого интерфейса.

**Функциональность:**

- Подключение к WebSocket для получения обновлений о новых товарах в реальном времени.
- Управление и настройка цен на предметы.
- Автоматическое обновление цен в зависимости от текущих условий рынка.
- Поддержка ручного и автоматического режима обновления цен.
- Отображение истории цен и текущих предложений на рынке.

Приложение обеспечивает удобный интерфейс для пользователей, позволяя им эффективно управлять своим инвентарем и быстро реагировать на изменения рынка косметических предметов для игры CS2.
## Превью

![Страница продажи предметов](https://i.ibb.co/64Qz2Rt/sale-page.png)

## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner

## Inspiration

- [Create React App](https://github.com/facebook/create-react-app/tree/main/packages/cra-template)
- [Vite](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react)
- [Vitest](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib)
