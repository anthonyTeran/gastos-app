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

# ===== CATEGORIAS =====

class CategoriaBase(BaseModel):
    nombre: str
    tipo: str

class CategoriaCreate(CategoriaBase):
    pass

class Categoria(BaseModel):
    id: int
    nombre: str
    tipo: str
    activo: bool

    model_config = ConfigDict(from_attributes=True)

class CategoriaUpdate(BaseModel):
    nombre: str
    tipo: str

# ===== MOVIMIENTOS =====

class MovimientoBase(BaseModel):
    descripcion: str
    monto: float
    tipo: str
    categoria_id: int
    fecha: date

class MovimientoCreate(MovimientoBase):
    pass

class Movimiento(MovimientoBase):
    id: int
    usuario_id: int

    categoria: Categoria | None = None

    model_config = ConfigDict(from_attributes=True)

# ===== LOGIN =====

class LoginData(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str