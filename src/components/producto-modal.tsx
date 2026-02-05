"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Store } from '@prisma/client';
import { createUpdateProduct } from "@/actions/product/create-update-product"
import Swal from "sweetalert2";
import { ImagePlus, X, UploadCloud } from "lucide-react" // Iconos necesarios

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
    descripcion: "",
  })

  // 👇 Nuevos estados para manejar la imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Referencia al input oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 👇 Función para manejar cambios en inputs de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProducto(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  // 👇 Manejo de selección de archivo (Input normal)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // 👇 Manejo de Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    } else {
      Swal.fire({
          icon: 'error',
          title: 'Archivo no válido',
          text: 'Por favor sube un archivo de imagen.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
      });
    }
  };

  // 👇 Procesa el archivo para generar preview y guardar en estado
  const processFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // 👇 Eliminar imagen seleccionada
  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 👇 Función para guardar
  const saveProduct = async () => {
    if (!producto.nombre || !producto.precio || !producto.cantidad) {
         Swal.fire({ icon: "warning", title: "Faltan datos", text: "Por favor completa los campos obligatorios." });
         return;
    }

    const formData = new FormData();
    formData.append("name", producto.nombre);
    formData.append("price", producto.precio.toString());
    formData.append("stock", producto.cantidad.toString());
    formData.append("storeId", tienda.id.toString());
    formData.append("description", producto.descripcion);
    
    // 👇 Aquí enviamos el archivo real si existe
    if (selectedFile) {
      formData.append("image", selectedFile); 
    }

    // Nota: Tu Server Action debe estar preparado para recibir 'image' como File
    const res = await createUpdateProduct(formData);
    
    if (res.ok) {
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Producto creado!",
        showConfirmButton: false,
        timer: 1500
      });
      handleClose(); // Usamos una función de cierre que limpia
    } else {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Error al crear el producto",
        text: res.message,
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleClose = () => {
    // Limpiar formulario al cerrar
    setProducto({ nombre: "", precio: "", cantidad: "", descripcion: "" });
    removeImage();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa la información del producto para agregarlo al inventario de {tienda.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Ej: Remera Vintage" value={producto.nombre} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="precio">Precio</Label>
                <Input id="precio" type="number" placeholder="15000" value={producto.precio} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="cantidad">Cantidad Inicial</Label>
            <Input id="cantidad" type="number" placeholder="10" value={producto.cantidad} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Textarea id="descripcion" placeholder="Descripción del producto..." value={producto.descripcion} onChange={handleChange} />
          </div>

          {/* Área de Imagen (Drag & Drop) */}
          <div>
            <Label className="mb-2 block">Imagen del Producto</Label>
            
            {previewUrl ? (
              // Vista Previa
              <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-contain" 
                />
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
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
                        {isDragging ? "Suelta la imagen aquí" : "Haz clic o arrastra una imagen"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                </div>
                {/* Input oculto */}
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

          <div className="flex space-x-3 pt-2">
            <Button onClick={saveProduct} className="flex-1">
              Guardar Producto
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>

          
        </div>
      </DialogContent>
    </Dialog>
  )
}