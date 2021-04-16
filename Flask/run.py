from app import app, PRODUCTION

app.run(debug=not PRODUCTION)