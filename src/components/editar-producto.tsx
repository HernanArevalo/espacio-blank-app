"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Trash2, ImagePlus, UploadCloud, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Product, Store } from "@/interfaces"
import { createUpdateProduct } from "@/actions/product/create-update-product"
import { toast } from "sonner"

interface EditarProductoProps {
  tienda: Store
  producto: Product
}

export function EditarProducto({ tienda, producto }: EditarProductoProps) {
  const router = useRouter()
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: producto.name,
    price: producto.price.toString(),
    stock: producto.stock.toString(),
    description: producto.description || "",
  })

  // Estados para manejo de imagen
  const [currentImage, setCurrentImage] = useState(producto.image) // Imagen actual (URL)
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // Nueva imagen (Archivo)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // Preview de la nueva imagen
  const [isDragging, setIsDragging] = useState(false)
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // -- MANEJO DE INPUTS TEXTO --
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // -- MANEJO DE IMAGEN (Drag & Drop) --
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processFile(file)
    } else {
      toast.error("Archivo no válido", { description: "Por favor sube una imagen." })
    }
  }

  const processFile = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const removeSelectedImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // -- GUARDAR CAMBIOS --
  const handleSave = async () => {
    setIsLoading(true)

    try {
      const data = new FormData()
      data.append("id", producto.id.toString()) // IMPORTANTE: ID para actualizar
      data.append("storeId", tienda.id.toString())
      data.append("name", formData.name)
      data.append("price", formData.price)
      data.append("stock", formData.stock)
      data.append("description", formData.description)

      // Si hay un archivo nuevo seleccionado, lo enviamos
      if (selectedFile) {
        data.append("image", selectedFile)
      }

      const res = await createUpdateProduct(data)

      if (res.ok) {
        toast.success("Producto actualizado")
        router.push(`/tiendas/${tienda.id}`)
        router.refresh() // Refrescar cache de Next.js
      } else {
        toast.error("Error al actualizar", { description: res.message })
      }

    } catch (error) {
      toast.error("Error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  // -- ELIMINAR (Pendiente de tu Server Action de eliminar) --
  const handleDelete = async () => {
    setIsLoading(true)
    // Aquí deberías llamar a una action real como deleteProduct(producto.id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Producto eliminado:", producto.id)
    
    toast.success("Producto eliminado")
    setIsLoading(false)
    setShowDeleteDialog(false)
    router.push(`/tiendas/${tienda.id}`)
  }

  const isFormValid = formData.name.trim() && formData.price && formData.stock

  // Determinar qué imagen mostrar en el preview final
  const displayImage = previewUrl || currentImage || "/placeholder.svg"

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-4 self-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tiendas/${tienda.id}`)}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {tienda.name}
          </Button>
        </div>
        <div className="flex space-x-3 self-end sm:self-auto">
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Eliminar producto?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. El producto "{producto.name}" será eliminado permanentemente.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                  {isLoading ? "Eliminando..." : "Eliminar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={!isFormValid || isLoading} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Editar Producto</CardTitle>
            <CardDescription>Modifica la información del producto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Área de Imagen */}
            <div>
              <Label className="mb-2 block">Imagen del Producto</Label>
              {previewUrl ? (
                // Si hay una NUEVA imagen seleccionada
                <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <button 
                    onClick={removeSelectedImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                // Dropzone
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex flex-col items-center text-slate-500">
                      {isDragging ? (
                          <UploadCloud className="h-10 w-10 text-blue-500 mb-2" />
                      ) : (
                          <ImagePlus className="h-10 w-10 mb-2 opacity-50" />
                      )}
                      <p className="text-sm font-medium">
                          {isDragging ? "Suelta la imagen aquí" : "Clic para cambiar imagen"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Remera Vintage"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precio">Precio *</Label>
                <Input
                  id="precio"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="15000"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descripción del producto..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vista previa en tiempo real */}
        <Card className="h-fit sticky top-6">
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>Así se verá el producto en la tienda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="w-full h-64 bg-slate-50 rounded-md mb-4 overflow-hidden flex items-center justify-center border">
                <img
                  src={displayImage}
                  alt={formData.name || "Producto"}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.src = "/placeholder.svg" }}
                />
              </div>
              <h3 className="font-semibold text-xl mb-2">{formData.name || "Nombre del producto"}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-bold text-lg text-green-700">
                    ${formData.price ? Number(formData.price).toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stock disponible:</span>
                  <Badge
                    variant={
                      Number(formData.stock) > 10 ? "default" : Number(formData.stock) > 5 ? "secondary" : "destructive"
                    }
                    className="text-sm px-3"
                  >
                    {formData.stock || "0"} u.
                  </Badge>
                </div>
              </div>
              {formData.description && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 italic">{formData.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}