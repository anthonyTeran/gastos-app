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

@app.get(
    "/usuarios",
    response_model=list[schemas.Usuario]
)
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

@app.get("/saldo")
def saldo_usuario(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(obtener_usuario_actual)
):
    return {
        "saldo": crud.obtener_saldo_usuario(
            db,
            usuario_id
        )
    }

@app.delete("/movimientos/{movimiento_id}")
def borrar_movimiento(
    movimiento_id: int,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(
        obtener_usuario_actual
    )
):

    movimiento = crud.eliminar_movimiento(
        db,
        movimiento_id,
        usuario_id
    )

    if not movimiento:
        raise HTTPException(
            status_code=404,
            detail="Movimiento no encontrado"
        )

    return {
        "mensaje": "Movimiento eliminado"
    }

# ===== CATEGORIAS =====

@app.post("/categorias")
def crear_categoria(
    categoria: schemas.CategoriaCreate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(
        obtener_usuario_actual
    )
):
    return crud.crear_categoria(
        db,
        categoria,
        usuario_id
    )


@app.get("/categorias")
def listar_categorias(
    page: int = 1,
    limit: int = 5,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(
        obtener_usuario_actual
    )
):
    return crud.obtener_categorias(
        db,
        usuario_id,
        page,
        limit
    )


@app.put("/categorias/{categoria_id}")
def editar_categoria(
    categoria_id: int,
    data: schemas.CategoriaUpdate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(
        obtener_usuario_actual
    )
):
    return crud.actualizar_categoria(
        db,
        categoria_id,
        data,
        usuario_id
    )


@app.delete("/categorias/{categoria_id}")
def borrar_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(
        obtener_usuario_actual
    )
):
    return crud.eliminar_categoria(
        db,
        categoria_id,
        usuario_id
    )