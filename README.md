# Reader X AI

**Reader X AI** is a "read it later" application designed to convert news or article links into a more readable format, classify them, generate short summaries, and save them for future consumption. The application features a REST API for interacting with the service, making it versatile for various use cases. The project aims to provide an enhanced reading experience across web and mobile platforms, with future support for Android and iOS via React Native.

## Features

- **Readable Format Conversion**: Automatically converts messy article links into a clean, readable format.
- **Content Classification**: Classifies articles into predefined categories for easy browsing.
- **Summary Generation**: Generates concise summaries (within 60 words) for each article.
- **Save for Later**: Stores articles in a database for future reference.
- **REST API**: Offers a RESTful API to interact with the application's core functionalities.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (future support for other databases possible)
- **Frontend**:
  - **Web**: HTML, CSS, JavaScript
  - **Web**: React (to be implemented later)
  - **Mobile** (future): React Native for Android (iOS coming later)
- **ORM**: Sequelize (or another ORM depending on future support)
- **Job Queue**: Redis (for handling background tasks)

## Future Enhancements

- **React Native Support**: Extend to Android first, followed by iOS.
- **Advanced Content Classification**: Improve AI-driven classification models.
- **User Interface**: Enhance the UI/UX for both web and mobile versions.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [SQLite](https://www.sqlite.org/index.html) or other supported databases
- [Redis](https://redis.io/) for job queue functionality

## Contribution

We welcome contributions from the community! Feel free to open issues or submit pull requests for bug fixes, feature requests, or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
