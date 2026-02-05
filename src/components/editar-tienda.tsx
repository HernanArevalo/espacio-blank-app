"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Percent, Save, Store, UploadCloud, ImagePlus, X, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { updateStore } from "@/actions/store/update-store"
import { Store as StoreInterface } from '@prisma/client';
import { delay } from "@/utils"

interface EditarTiendaProps {
  tienda: StoreInterface
}

export function EditarTienda({ tienda }: EditarTiendaProps) {
  const router = useRouter()

  const toPercentage = (factor: number) => Math.round((1 - factor) * 100)

  const [formData, setFormData] = useState({
    name: tienda.name,
    description: tienda.description || "",
    // Descuentos
    discountEfectivo: toPercentage(tienda.discountEfectivo),
    discountTransferencia: toPercentage(tienda.discountTransferencia),
    discountTarjeta: toPercentage(tienda.discountTarjeta),
  })

  // Estados de Imagen
  const [currentImage, setCurrentImage] = useState(tienda.image)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)

  // -- HANDLERS --

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }
  const processFile = (file: File) => {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith("image/")) processFile(file)
  }
  const removeSelectedImage = () => {
    setSelectedFile(null); setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("id", tienda.id.toString());
      data.append("name", formData.name);
      data.append("description", formData.description || "");

      data.append("discountEfectivo", formData.discountEfectivo.toString());
      data.append("discountTransferencia", formData.discountTransferencia.toString());
      data.append("discountTarjeta", formData.discountTarjeta.toString());

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await updateStore(data);

      if (res.ok) {
        toast.success("Tienda actualizada con éxito");

        await delay(1000);

        router.refresh();
        router.push("/admin");

      } else {
        toast.error("Error al actualizar", { description: res.message });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al intentar guardar");
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim() !== ""
  const displayImage = previewUrl || currentImage || "/placeholder.svg"

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
        </div>
        <Button onClick={handleSave} disabled={!isFormValid || isLoading}>
          <Save className="h-4 w-4 mr-2" /> {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Información General</CardTitle><CardDescription>Datos básicos de la tienda</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Nombre *</Label>
                <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea rows={3} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
              </div>

              <div>
                <Label className="mb-2 block">Logo de la Tienda</Label>
                {previewUrl ? (
                  <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    <button onClick={removeSelectedImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={16} /></button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="flex flex-col items-center text-slate-500">
                      <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-sm">Clic o arrastra imagen</span>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> Configuración de Descuentos</CardTitle>
              <CardDescription>Porcentajes de descuento por método de pago (0-100%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Efectivo</Label>
                  <div className="flex items-center mt-1 relative">
                    <Input type="number" min={0} max={100} value={formData.discountEfectivo} onChange={(e) => handleInputChange("discountEfectivo", e.target.value)} className="pr-8" />
                    <Percent className="h-4 w-4 absolute right-3 text-slate-400" />
                  </div>
                </div>
                <div>
                  <Label>Transferencia</Label>
                  <div className="flex items-center mt-1 relative">
                    <Input type="number" min={0} max={100} value={formData.discountTransferencia} onChange={(e) => handleInputChange("discountTransferencia", e.target.value)} className="pr-8" />
                    <Percent className="h-4 w-4 absolute right-3 text-slate-400" />
                  </div>
                </div>
                <div>
                  <Label>Tarjeta</Label>
                  <div className="flex items-center mt-1 relative">
                    <Input type="number" min={0} max={100} value={formData.discountTarjeta} onChange={(e) => handleInputChange("discountTarjeta", e.target.value)} className="pr-8" />
                    <Percent className="h-4 w-4 absolute right-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA: VISTA PREVIA */}
        <Card>
          <CardHeader><CardTitle>Vista Previa</CardTitle><CardDescription>Así se verá en el listado</CardDescription></CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16 border">
                  <AvatarImage src={displayImage} alt={formData.name} className="object-cover" />
                  <AvatarFallback>{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{formData.name || "Nombre"}</h3>
                  <p className="text-slate-600 line-clamp-2">{formData.description || "Sin descripción"}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-md mt-4">
                <h4 className="font-semibold text-sm mb-2 text-slate-700">Descuentos vigentes:</h4>
                <div className="flex gap-2 flex-wrap">
                  {Number(formData.discountEfectivo) > 0 && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">Efec: -{formData.discountEfectivo}%</span>}
                  {Number(formData.discountTransferencia) > 0 && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">Transf: -{formData.discountTransferencia}%</span>}
                  {Number(formData.discountTarjeta) > 0 && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-medium">Tarj: -{formData.discountTarjeta}%</span>}
                  {Number(formData.discountEfectivo) === 0 && Number(formData.discountTransferencia) === 0 && Number(formData.discountTarjeta) === 0 && <span className="text-xs text-slate-400 italic">Sin descuentos configurados</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}