import { ChevronDown, ChevronUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useState } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"


export function VentaRow({ venta }: { venta: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Fila Principal */}
      <TableRow 
        className="cursor-pointer hover:bg-slate-50 transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </TableCell>
        <TableCell>{new Date(venta.date).toLocaleString("es-AR")}</TableCell>
        <TableCell>{venta.client || "Cliente Ocasional"}</TableCell>
        <TableCell className="text-center">{venta.items?.length || 0}</TableCell>
        <TableCell>
          <Badge variant="outline" className="capitalize">
            {venta.paymentMethod}
          </Badge>
        </TableCell>
        <TableCell className="font-bold text-green-700">
          ${venta.total.toLocaleString()}
        </TableCell>
      </TableRow>

      {/* Fila de Detalle */}
      {isOpen && (
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableCell colSpan={6} className="p-4 shadow-inner">
            <div className="pl-10">
              <h4 className="font-semibold mb-3 text-sm text-slate-700">Detalle de Productos:</h4>
              
              <div className="rounded-md border bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Imagen</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {venta.items?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Avatar className="h-10 w-10 rounded-md">
                            <AvatarImage src={item.image || "/placeholder.svg"} />
                            <AvatarFallback>P</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right text-gray-600">
                          ${item.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(item.price * item.quantity).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Footer del detalle */}
              <div className="flex justify-end mt-4 gap-4 text-sm">
                 <div className="text-slate-500">ID Venta: #{venta.id}</div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}