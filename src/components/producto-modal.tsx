"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Store } from "@/interfaces"

interface ProductoModalProps {
  isOpen: boolean
  onClose: () => void
  tienda: Store
}

export function ProductoModal({ isOpen, onClose, tienda }: ProductoModalProps) {
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
            <Input id="nombre" placeholder="Ej: Remera Vintage" />
          </div>

          <div>
            <Label htmlFor="precio">Precio</Label>
            <Input id="precio" type="number" placeholder="15000" />
          </div>

          <div>
            <Label htmlFor="cantidad">Cantidad Inicial</Label>
            <Input id="cantidad" type="number" placeholder="10" />
          </div>

          <div>
            <Label htmlFor="imagen">URL de Imagen</Label>
            <Input id="imagen" placeholder="https://..." />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Textarea id="descripcion" placeholder="Descripción del producto..." />
          </div>

          <div className="flex space-x-3">
            <Button className="flex-1">Guardar Producto</Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
