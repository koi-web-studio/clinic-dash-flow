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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Interfaz para el tipo Appointment
interface Appointment {
  id: number;
  time: string;
  patient: string;
  doctor: string;
  status: "Confirmado" | "Pendiente" | "Atendido" | "No-show";
  duration: number;
}

// Mock data
const doctors = [
  { id: "1", name: "Dr. Pérez" },
  { id: "2", name: "Dra. Ramos" }
];

// Actualizar los estados posibles para incluir Atendido y No-show
const appointments = [
  { 
    id: 1, 
    time: "09:30", 
    patient: "Ana Torres", 
    doctor: "Dr. Pérez", 
    status: "Confirmado", // Confirmado | Pendiente | Atendido | No-show
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

// Mock user data - en una implementación real vendría de un contexto de autenticación
const mockUser = {
  id: "1",
  name: "Dr. Pérez",
  role: "DOCTOR" // DOCTOR | SECRETARY | OWNER
};

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-08-01"));
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false) ;
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    doctor: "",
    date: "",
    time: "",
    duration: "30",
    status: "Pendiente"
  });

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

  // Filtrar citas según el rol del usuario
  const filteredAppointments = appointments.filter(appointment => {
    if (mockUser.role === "DOCTOR") {
      // Los doctores solo ven sus propias citas
      return appointment.doctor === mockUser.name;
    } else if (mockUser.role === "SECRETARY" || mockUser.role === "OWNER") {
      // Secretarias y dueños pueden ver todas las citas o filtrar por doctor
      if (selectedDoctor !== "all") {
        const doctor = doctors.find(d => d.id === selectedDoctor);
        return doctor ? appointment.doctor === doctor.name : false;
      }
      return true;
    }
    return false;
  });

  const getAppointmentForSlot = (time: string) => {
    return filteredAppointments.find(apt => apt.time === time);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el nuevo turno
    console.log("Nuevo turno:", newAppointment);
    
    // Mostrar alerta de éxito
    alert("Turno creado con éxito");
    
    // Cerrar el diálogo y resetear el formulario
    setIsDialogOpen(false);
    setNewAppointment({
      patient: "",
      doctor: "",
      date: "",
      time: "",
      duration: "30",
      status: "Pendiente"
    });
  };

const handleStatusChange = (status: string) => {
  if (selectedAppointment) {
    // Aquí iría la lógica para actualizar el estado de la cita en la base de datos
    console.log(`Cita ${selectedAppointment.id} cambiada a estado: ${status}`);
    
    // Cerrar el diálogo
    setIsStatusDialogOpen(false);
    setSelectedAppointment(null);
    
    // Mostrar alerta de éxito
    alert(`Estado de la cita actualizado a: ${status}`);
  }
};

const openStatusDialog = (appointment: typeof appointments[0]) => {
  setSelectedAppointment(appointment);
  setIsStatusDialogOpen(true);
};



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">Gestión de turnos médicos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Turno</DialogTitle>
              <DialogDescription>
                Complete los datos del nuevo turno y haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patient" className="text-right">
                    Paciente
                  </Label>
                  <Input
                    id="patient"
                    name="patient"
                    value={newAppointment.patient}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doctor" className="text-right">
                    Doctor
                  </Label>
                  <Select 
                    name="doctor" 
                    value={newAppointment.doctor} 
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, doctor: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.name}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Hora
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duración
                  </Label>
                  <Select 
                    name="duration" 
                    value={newAppointment.duration} 
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar duración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Estado
                  </Label>
                  <Select 
                    name="status" 
                    value={newAppointment.status} 
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Confirmado">Confirmado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
            {filteredAppointments.map((appointment) => (
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

          {/* Leyenda actualizada */}
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
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Atendido</span>
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

