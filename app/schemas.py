from pydantic import BaseModel, ConfigDict
from datetime import date

# ===== USUARIO =====

class UsuarioCreate(BaseModel):
    nombre: str
    email: str
    password: str

class Usuario(BaseModel):
    id: int
    nombre: str
    email: str

    model_config = ConfigDict(from_attributes=True)

# ===== MOVIMIENTOS =====

class MovimientoBase(BaseModel):
    descripcion: str
    monto: float
    tipo: str
    categoria: str
    fecha: date

class MovimientoCreate(MovimientoBase):
    pass

class Movimiento(MovimientoBase):
    id: int
    usuario_id: int

    model_config = ConfigDict(from_attributes=True)
class LoginData(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ===== CATEGORIAS =====

class CategoriaBase(BaseModel):
    nombre: str
    tipo: str

class CategoriaCreate(CategoriaBase):
    pass

class Categoria(CategoriaBase):
    id: int
    usuario_id: int

    model_config = ConfigDict(
        from_attributes=True
    )