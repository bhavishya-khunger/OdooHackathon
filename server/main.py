from fastapi import FastAPI

app = FastAPI(title="Odoo Hackathon API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Odoo Hackathon API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
