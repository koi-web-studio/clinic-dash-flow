import { useState } from "react";
import { Eye, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data - en una implementación real vendría de una API
const patients = [
  {
    id: 1,
    name: "Ana Torres",
    dni: "12.345.678",
    phone: "11-1234-5678",
    insurance: "OSDE",
    doctor: "Dr. Pérez",
    doctorId: "1"
  },
  {
    id: 2,
    name: "Carlos López",
    dni: "23.456.789",
    phone: "11-2345-6789",
    insurance: "Swiss Medical",
    doctor: "Dra. Ramos",
    doctorId: "2"
  },
  {
    id: 3,
    name: "Marta Gómez",
    dni: "34.567.890",
    phone: "11-3456-7890",
    insurance: "Galeno",
    doctor: "Dr. Pérez",
    doctorId: "1"
  }
];

// Mock user data - en una implementación real vendría de un contexto de autenticación
const mockUser = {
  id: "1",
  name: "Dr. Pérez",
  role: "DOCTOR"
};

export default function MyPatients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);

  // Filtrar pacientes por doctorId y término de búsqueda
  const filteredPatients = patients
    .filter(patient => patient.doctorId === mockUser.id)
    .filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.dni.includes(searchTerm)
    );

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedPatient) {
      setSelectedPatient({
        ...selectedPatient,
        [name]: value
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el paciente en la base de datos
    setIsEditDialogOpen(false);
    setSelectedPatient(null);
    alert("Paciente actualizado con éxito!");
  };

  const handleView = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Pacientes</h1>
          <p className="text-muted-foreground">Gestión de sus pacientes asignados</p>
        </div>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Pacientes ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Obra Social</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.dni}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.insurance}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleView(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron pacientes asignados a usted
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para Ver Paciente */}
      {selectedPatient && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalles del Paciente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Nombre:</Label>
                <div className="col-span-3">{selectedPatient.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">DNI:</Label>
                <div className="col-span-3">{selectedPatient.dni}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Teléfono:</Label>
                <div className="col-span-3">{selectedPatient.phone}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Obra Social:</Label>
                <div className="col-span-3">{selectedPatient.insurance}</div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo para Editar Paciente */}
      {selectedPatient && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Paciente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={selectedPatient.name}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-dni" className="text-right">
                    DNI
                  </Label>
                  <Input
                    id="edit-dni"
                    name="dni"
                    value={selectedPatient.dni}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={selectedPatient.phone}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-insurance" className="text-right">
                    Obra Social
                  </Label>
                  <Input
                    id="edit-insurance"
                    name="insurance"
                    value={selectedPatient.insurance}
                    onChange={handleEditInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}