import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react";
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

// Mock data
const patients = [
  {
    id: 1,
    name: "Ana Torres",
    dni: "12.345.678",
    phone: "11-1234-5678",
    insurance: "OSDE",
    doctor: "Dr. Pérez"
  },
  {
    id: 2,
    name: "Carlos López",
    dni: "23.456.789",
    phone: "11-2345-6789",
    insurance: "Swiss Medical",
    doctor: "Dra. Ramos"
  },
  {
    id: 3,
    name: "Marta Gómez",
    dni: "34.567.890",
    phone: "11-3456-7890",
    insurance: "Galeno",
    doctor: "Dr. Pérez"
  }
];

// Mock user role
const userRole = "SECRETARY"; // DOCTOR | SECRETARY | OWNER

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.dni.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
          <p className="text-muted-foreground">Gestión de pacientes del sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Paciente
        </Button>
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
          <CardTitle>Lista de Pacientes ({filteredPatients.length})</CardTitle>
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
                  {(userRole === "SECRETARY" || userRole === "OWNER") && (
                    <TableHead>Doctor</TableHead>
                  )}
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
                    {(userRole === "SECRETARY" || userRole === "OWNER") && (
                      <TableCell>{patient.doctor}</TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
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
              No se encontraron pacientes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}