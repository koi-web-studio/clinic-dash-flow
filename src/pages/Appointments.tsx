import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const doctors = [
  { id: "1", name: "Dr. Pérez" },
  { id: "2", name: "Dra. Ramos" }
];

const appointments = [
  { 
    id: 1, 
    time: "09:30", 
    patient: "Ana Torres", 
    doctor: "Dr. Pérez", 
    status: "Confirmado",
    duration: 30 
  },
  { 
    id: 2, 
    time: "11:00", 
    patient: "Carlos López", 
    doctor: "Dra. Ramos", 
    status: "Pendiente",
    duration: 30 
  },
];

// Mock user role
const userRole = "SECRETARY"; // DOCTOR | SECRETARY | OWNER

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-08-01"));
  const [selectedDoctor, setSelectedDoctor] = useState("all");

  // Generar slots de 15 minutos desde 08:00 hasta 18:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAppointmentForSlot = (time: string) => {
    return appointments.find(apt => apt.time === time);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">Gestión de turnos médicos</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Turno
        </Button>
      </div>

      {/* Controles de navegación */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Navegación de fecha */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => changeDate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center min-w-[200px]">
                <p className="font-medium text-foreground capitalize">
                  {formatDate(selectedDate)}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => changeDate(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Selector de doctor (solo para secretaria/owner) */}
            {(userRole === "SECRETARY" || userRole === "OWNER") && (
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleccionar doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los doctores</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendario semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Turnos del Día</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Vista desktop: grid de slots */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-2 max-h-[600px] overflow-y-auto">
              {timeSlots.map((time) => {
                const appointment = getAppointmentForSlot(time);
                
                if (appointment) {
                  return (
                    <div
                      key={time}
                      className={`p-2 rounded text-xs border cursor-pointer transition-colors ${
                        appointment.status === "Confirmado"
                          ? "bg-confirmed text-confirmed-foreground"
                          : appointment.status === "Pendiente" 
                          ? "border-primary text-pending-foreground bg-pending"
                          : "bg-no-show text-no-show-foreground"
                      }`}
                    >
                      <div className="font-medium">{time}</div>
                      <div className="truncate">{appointment.patient}</div>
                      <div className="truncate">{appointment.doctor}</div>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={time}
                    className="p-2 rounded text-xs border border-divider text-muted-foreground hover:bg-accent cursor-pointer transition-colors"
                  >
                    {time}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vista móvil: lista vertical */}
          <div className="md:hidden space-y-2">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-3 rounded border ${
                  appointment.status === "Confirmado"
                    ? "bg-confirmed text-confirmed-foreground"
                    : appointment.status === "Pendiente" 
                    ? "border-primary text-pending-foreground"
                    : "bg-no-show text-no-show-foreground"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{appointment.time}</div>
                    <div>{appointment.patient}</div>
                    <div className="text-sm opacity-75">{appointment.doctor}</div>
                  </div>
                  <div className="text-xs">{appointment.status}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="mt-6 pt-4 border-t border-divider">
            <p className="text-sm text-muted-foreground mb-2">Leyenda:</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-confirmed rounded"></div>
                <span>Confirmado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-primary rounded"></div>
                <span>Pendiente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-no-show rounded"></div>
                <span>No-show</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}