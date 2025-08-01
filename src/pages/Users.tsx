import { useState } from "react";
import { Plus, Edit, Trash2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data
const users = [
  {
    id: 1,
    name: "Dr. Juan Pérez",
    email: "juan.perez@clinica.com",
    role: "DOCTOR",
    status: "Activo",
    lastLogin: "2025-08-01 08:30"
  },
  {
    id: 2,
    name: "Dra. María Ramos",
    email: "maria.ramos@clinica.com",
    role: "DOCTOR",
    status: "Activo",
    lastLogin: "2025-08-01 09:15"
  },
  {
    id: 3,
    name: "Ana González",
    email: "ana.gonzalez@clinica.com",
    role: "SECRETARY",
    status: "Activo",
    lastLogin: "2025-08-01 07:45"
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    email: "carlos.mendoza@clinica.com",
    role: "SECRETARY",
    status: "Inactivo",
    lastLogin: "2025-07-28 16:20"
  }
];

const getRoleBadge = (role: string) => {
  const variants = {
    DOCTOR: "default",
    SECRETARY: "secondary",
    OWNER: "destructive"
  };
  
  const labels = {
    DOCTOR: "Doctor",
    SECRETARY: "Secretaria",
    OWNER: "Propietario"
  };

  return (
    <Badge variant={variants[role as keyof typeof variants] as any}>
      {labels[role as keyof typeof labels]}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  return (
    <Badge variant={status === "Activo" ? "default" : "secondary"}>
      {status}
    </Badge>
  );
};

export default function Users() {
  const [users_] = useState(users);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administración de accesos al sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Resumen de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserCircle className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {users_.filter(u => u.role === "DOCTOR").length}
                </p>
                <p className="text-sm text-muted-foreground">Doctores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserCircle className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {users_.filter(u => u.role === "SECRETARY").length}
                </p>
                <p className="text-sm text-muted-foreground">Secretarias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserCircle className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {users_.filter(u => u.status === "Activo").length}
                </p>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({users_.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users_.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
        </CardContent>
      </Card>
    </div>
  );
}