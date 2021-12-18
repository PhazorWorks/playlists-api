# Playlists API

# Introduction
Small API to manage apollo's playlists

# Endpoints
| Endpoint | Route      | Description                                                | Query              | Body                                     |
|----------|------------|------------------------------------------------------------|--------------------|------------------------------------------|
| Create   | /create    | Create a playlist                                          | key                | JSON with "tracks", "user_id" and "name" |
| Update   | /update    | Update playlist with new tracks                            | key                | JSON with "tracks", "user_id" and "name" |
| Delete   | /delete    | Delete a playlist                                          | key                | JSON with "user_Id" and "name"           |
| List     | /list      | List playlists                                             | key, user_id       | None                                     |
| Get      | /get       | Get a playlist                                             | key, user_id, name | None                                     |
| Share    | /share/:id | Get a html rendered version of playlist or public playlist | raw (optional)     | None                                     |

# Environment variables
```dotenv
API_KEY=random_long_string
PORT=3030
MONGODB_CONNECTION_URL=mongodb+srv://xx:xx@xx.xx.mongodb.net/<database_name>
```
