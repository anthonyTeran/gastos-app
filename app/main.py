from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import SessionLocal, engine, Base
from . import schemas, crud
from .auth import (
    create_access_token,
    obtener_usuario_actual
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

# ===== ROOT =====

@app.get("/")
def root():
    return {
        "mensaje": "API funcionando"
    }

# ===== USUARIOS =====

@app.post(
    "/usuarios",
    response_model=schemas.Usuario
)
def crear_usuario(
    usuario: schemas.UsuarioCreate,
    db: Session = Depends(get_db)
):
    return crud.crear_usuario(db, usuario)

@app.get("/usuarios")
def listar_usuarios(
    db: Session = Depends(get_db)
):
    return crud.obtener_usuarios(db)

# ===== LOGIN =====

@app.post(
    "/login",
    response_model=schemas.Token
)
def login(
    data: schemas.LoginData,
    db: Session = Depends(get_db)
):

    usuario = crud.autenticar_usuario(
        db,
        data.email,
        data.password
    )

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    token = create_access_token(
        data={
            "sub": usuario.email,
            "user_id": usuario.id
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# ===== MOVIMIENTOS =====

@app.post(
    "/movimientos",
    response_model=schemas.Movimiento
)
def crear_movimiento(
    movimiento: schemas.MovimientoCreate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(
        obtener_usuario_actual
    )
):
    return crud.crear_movimiento(
        db,
        movimiento,
        usuario_id
    )

@app.get("/movimientos")
def listar_movimientos(
    page: int = 1,
    limit: int = 5,
    fecha_desde: str = None,
    fecha_hasta: str = None,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(
        obtener_usuario_actual
    )
):

    return crud.obtener_movimientos(
        db,
        usuario_id,
        page,
        limit,
        fecha_desde,
        fecha_hasta
    )

@app.get("/saldo/{usuario_id}")
def saldo_usuario(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return {
        "saldo": crud.obtener_saldo_usuario(
            db,
            usuario_id
        )
    }