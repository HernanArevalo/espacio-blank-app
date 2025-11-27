"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Store } from "@/interfaces"
import { createUpdateProduct } from "@/actions/product/create-update-product"
import Swal from "sweetalert2";


interface ProductoModalProps {
  isOpen: boolean
  onClose: () => void
  tienda: Store
}

export function ProductoModal({ isOpen, onClose, tienda }: ProductoModalProps) {
  // 👇 Estado local para los valores del formulario
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    cantidad: "",
    imagen: "",
    descripcion: "",
  })

  // 👇 Función para manejar cambios en cualquier input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProducto(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  // 👇 Función para guardar
  const saveProduct = async () => {
    const formData = new FormData();
    formData.append("name", producto.nombre);
    formData.append("price", producto.precio.toString());
    formData.append("stock", producto.cantidad.toString());
    formData.append("storeId", tienda.id.toString());
    formData.append("description", producto.descripcion);
    formData.append("image", producto.imagen);

    const res = await createUpdateProduct(formData);
    console.log(res);

    if (res.ok) {
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Producto creado!",
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Error al crear el producto",
        text: res.message,
        showConfirmButton: false,
        timer: 1500
      });
    }
    onClose()
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa la información del producto para agregarlo al inventario de {tienda.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Producto</Label>
            <Input id="nombre" placeholder="Ej: Remera Vintage" value={producto.nombre} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="precio">Precio</Label>
            <Input id="precio" type="number" placeholder="15000" value={producto.precio} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="cantidad">Cantidad Inicial</Label>
            <Input id="cantidad" type="number" placeholder="10" value={producto.cantidad} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="imagen">URL de Imagen</Label>
            <Input id="imagen" placeholder="https://..." value={producto.imagen} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Textarea id="descripcion" placeholder="Descripción del producto..." value={producto.descripcion} onChange={handleChange} />
          </div>

          <div className="flex space-x-3">
            <Button onClick={saveProduct} className="flex-1">
              Guardar Producto
              </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
