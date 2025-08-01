import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const metrics = [
  {
    title: "Pacientes Totales",
    value: "847",
    icon: Users,
    description: "+12 este mes"
  },
  {
    title: "Citas Hoy",
    value: "24",
    icon: Calendar,
    description: "6 pendientes"
  },
  {
    title: "Promedio Consulta",
    value: "32 min",
    icon: Clock,
    description: "Dentro del rango"
  },
  {
    title: "Ocupación",
    value: "84%",
    icon: TrendingUp,
    description: "+5% vs mes anterior"
  }
];

const todayAppointments = [
  { time: "09:30", patient: "Ana Torres", doctor: "Dr. Pérez", status: "Confirmado" },
  { time: "10:15", patient: "Carlos López", doctor: "Dra. Ramos", status: "Pendiente" },
  { time: "11:00", patient: "Marta Gómez", doctor: "Dr. Pérez", status: "Confirmado" },
  { time: "14:30", patient: "Luis Castro", doctor: "Dra. Ramos", status: "Pendiente" }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del sistema médico</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Citas de hoy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments.map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md border border-divider"
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-foreground">
                    {appointment.time}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {appointment.patient}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {appointment.doctor}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    appointment.status === "Confirmado"
                      ? "bg-confirmed text-confirmed-foreground"
                      : "border border-primary text-pending-foreground"
                  }`}
                >
                  {appointment.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}