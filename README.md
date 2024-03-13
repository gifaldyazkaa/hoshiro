![Banner](https://cdn.discordapp.com/attachments/1192399828567740548/1193467564035149934/Hoshiro_BE_Banner.png)

> [!NOTE]
> Please note that this API is still under development. Breaking changes to the endpoints may happen.

## 🚦 Endpoints

Base URL: https://api.hoshiro.falcxxdev.cyou

Available regions: Indonesia (`id`), Malaysia (`my`), Singapore (`sg`).

| Route                | Method | Parameters             | Required | Examples               |
| -------------------- | ------ | ---------------------- | -------- | ---------------------- |
| `/auth/register`     | POST   | `username`, `password` | Yes      | `johndoe`, `john123`   |
| `/auth/login`        | POST   | `username`, `password` | Yes      | `johndoe`, `john123`   |
| `/:region`           | GET    | -                      | -        | `/id`                  |
| `/:region`           | POST   | `...`                  | Yes      | `/id`                  |
| `/:region`           | PATCH  | `...`                  | Yes      | `/id`                  |
| `/:region/active`    | GET    | -                      | -        | `/sg/active`           |
| `/:region/graduated` | GET    | -                      | -        | `/my/graduated`        |
| `/:region/:handle`   | GET    | `/:handle`             | Yes      | `/id/@amayaclorentine` |

## ➡️ Development

### 🛠️ Requirements

A [bun.sh](https://bun.sh) >= 1.0.20 setup with [node.js](https://nodejs.org) >= 16.x (for production) is recommended.

### 📦 Install dependencies

```sh
$ bun install
```

### 📝 Create environment file

```
MONGODB_URI="your mongodb connection uri"
SECRET_SESSION="hashed secret string"
DISCORD_CLIENT_ID="discord client id"
DISCORD_CLIENT_SECRET="discord client secret"
DISCORD_REDIRECT_URI="discord redirect uri"
```

### 🚀 Start development server

```sh
$ bun run dev
#
# [INFO] App connected to MongoDB Atlas!
# [INFO] Express server has been started! (Live at port xxxx)
```

## 💖 Thanks to

-   [Bun.sh](https://bun.sh) for their super-fast runtime
-   [GitHub Codespaces](https://github.com/codespaces) and [Project IDX](https://idx.dev) for providing their fast developer environment
-   [@BayuDC](https://github.com/BayuDC) for offering his VPS to host this RESTful API
-   [Agis Lugandi](https://www.instagram.com/lugandiagis) and [Shigure](https://www.facebook.com/ahmad.supriono.359) for their contributions on suggesting some new project name

## 📃 License

This project is licensed under [MIT License](./LICENSE).
