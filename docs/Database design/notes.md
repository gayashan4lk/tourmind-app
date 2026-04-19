# Entities
- HostUser
- Place
- Category
- PlaceImage

# Relationships

HostUser (1) ─────── manages ─────── (N) Place

Category (1) ─────── categorizes ─────── (N) Place

Place (1) ─────── has ─────── (N) PlaceImage

# 🚀 8. API Mapping (Matches Your SRS)
Endpoint	Table Used
GET /places	places + categories
GET /places/:id	places
GET /places?category=	places + categories
POST /places	places
PUT /places/:id	places
DELETE /places/:id	places
POST /host/login	host_users