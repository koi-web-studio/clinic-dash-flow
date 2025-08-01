import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock data - en implementación real vendría de API
const mockPatients = {
  "1": {
    id: 1,
    name: "Ana Torres",
    dni: "12.345.678",
    phone: "11-1234-5678",
    email: "ana.torres@email.com",
    address: "Av. Corrientes 1234, CABA",
    insurance: "OSDE",
    insuranceNumber: "123456789",
    doctor: "Dr. Pérez",
    birthDate: "1985-03-15",
    medicalHistory: [
      { date: "2024-12-15", diagnosis: "Control rutinario", doctor: "Dr. Pérez" },
      { date: "2024-11-20", diagnosis: "Hipertensión leve", doctor: "Dr. Pérez" },
      { date: "2024-10-10", diagnosis: "Análisis de sangre", doctor: "Dr. Pérez" }
    ]
  }
};

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const patient = mockPatients[id as keyof typeof mockPatients];

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Paciente no encontrado</p>
        <Button onClick={() => navigate("/patients")} className="mt-4">
          Volver a Pacientes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-muted-foreground">DNI: {patient.dni}</p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información personal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-medium">{patient.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                  <p className="font-medium">{patient.birthDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información médica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Médica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Obra Social</p>
              <p className="font-medium">{patient.insurance}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Número de Afiliado</p>
              <p className="font-medium">{patient.insuranceNumber}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Doctor Asignado</p>
              <p className="font-medium">{patient.doctor}</p>
            </div>
          </CardContent>
        </Card>

        {/* Historial médico */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Historial Médico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patient.medicalHistory.map((record, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{record.diagnosis}</p>
                      <p className="text-sm text-muted-foreground">{record.doctor}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </div>
                  {index < patient.medicalHistory.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}