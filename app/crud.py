from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas
from .auth import hash_password, verify_password

# ===== USUARIOS =====

def crear_usuario(db: Session, usuario: schemas.UsuarioCreate):

    password_hash = hash_password(usuario.password)

    nuevo = models.Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password=password_hash
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo

def obtener_usuarios(db: Session):
    return db.query(models.Usuario).all()

def autenticar_usuario(
    db: Session,
    email: str,
    password: str
):
    usuario = (
        db.query(models.Usuario)
        .filter(models.Usuario.email == email)
        .first()
    )

    if not usuario:
        return None

    if not verify_password(
        password,
        usuario.password
    ):
        return None

    return usuario

# ===== MOVIMIENTOS =====

def crear_movimiento(
    db: Session,
    movimiento: schemas.MovimientoCreate,
    usuario_id: int
):
    datos = movimiento.model_dump()

    datos["usuario_id"] = usuario_id

    nuevo = models.Movimiento(
        **datos
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo

def eliminar_movimiento(
    db: Session,
    movimiento_id: int,
    usuario_id: int
):
    movimiento = (
        db.query(models.Movimiento)
        .filter(
            models.Movimiento.id == movimiento_id,
            models.Movimiento.usuario_id == usuario_id
        )
        .first()
    )

    if not movimiento:
        return None

    db.delete(movimiento)

    db.commit()

    return movimiento

def obtener_movimientos(
    db: Session,
    usuario_id: int,
    page: int,
    limit: int,
    fecha_desde=None,
    fecha_hasta=None
):

    query = db.query(models.Movimiento).filter(
            models.Movimiento.usuario_id == usuario_id
            )

    # FILTROS FECHA

    if fecha_desde:
        query = query.filter(
            models.Movimiento.fecha >= fecha_desde
        )

    if fecha_hasta:
        query = query.filter(
            models.Movimiento.fecha <= fecha_hasta
        )

    total = query.count()

    offset = (page - 1) * limit

    movimientos = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    ingresos = (
        query
        .filter(models.Movimiento.tipo == "ingreso")
        .with_entities(
            func.sum(models.Movimiento.monto)
        )
        .scalar()
    ) or 0

    gastos = (
        query
        .filter(models.Movimiento.tipo == "gasto")
        .with_entities(
            func.sum(models.Movimiento.monto)
        )
        .scalar()
    ) or 0

    saldo = ingresos - gastos

    return {
        "items": movimientos,
        "total": total,
        "ingresos": ingresos,
        "gastos": gastos,
        "saldo": saldo
    }

def obtener_saldo_usuario(
    db: Session,
    usuario_id: int
):
    movimientos = (
        db.query(models.Movimiento)
        .filter(
            models.Movimiento.usuario_id == usuario_id
        )
        .all()
    )

    saldo = 0

    for mov in movimientos:
        if mov.tipo == "ingreso":
            saldo += mov.monto
        else:
            saldo -= mov.monto

    return saldo