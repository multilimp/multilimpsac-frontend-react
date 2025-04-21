
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { cn } from "@/app/core/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for the sales report
const salesData = [
  { month: "Ene", ventas: 45000 },
  { month: "Feb", ventas: 35000 },
  { month: "Mar", ventas: 55000 },
  { month: "Abr", ventas: 40000 },
  { month: "May", ventas: 60000 },
  { month: "Jun", ventas: 48000 },
  { month: "Jul", ventas: 52000 },
  { month: "Ago", ventas: 61000 },
  { month: "Sep", ventas: 58000 },
  { month: "Oct", ventas: 65000 },
  { month: "Nov", ventas: 70000 },
  { month: "Dic", ventas: 75000 },
];

const SalesReportPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  const [viewType, setViewType] = useState("monthly");

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reporte de Ventas</h1>
          <p className="text-muted-foreground">
            Visualice y analice los datos de ventas
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>
                Seleccione el período y tipo de visualización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none">
                      Período
                    </label>
                  </div>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "dd/MM/yyyy")} -{" "}
                                {format(date.to, "dd/MM/yyyy")}
                              </>
                            ) : (
                              format(date.from, "dd/MM/yyyy")
                            )
                          ) : (
                            <span>Seleccione un período</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none">
                    Vista
                  </label>
                  <Select
                    defaultValue={viewType}
                    onValueChange={(value) => setViewType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de vista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="mt-2 bg-multilimp-green hover:bg-multilimp-green-dark">
                  Generar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>
                Resumen de ventas para el período seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total de ventas</p>
                  <p className="text-2xl font-bold">S/ 614,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Promedio mensual</p>
                  <p className="text-2xl font-bold">S/ 51,167</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Crecimiento</p>
                  <p className="text-2xl font-bold text-green-600">+15.4%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Proyección</p>
                  <p className="text-2xl font-bold">S/ 720,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ventas Mensuales 2023</CardTitle>
            <CardDescription>
              Visualización gráfica de las ventas por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`S/ ${value}`, "Ventas"]}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="ventas" fill="#47A882" name="Ventas (S/)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos Detallados</CardTitle>
            <CardDescription>
              Tabla de ventas mensuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Mes</th>
                    <th className="py-3 px-4 text-right font-medium">Ventas (S/)</th>
                    <th className="py-3 px-4 text-right font-medium">% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((item, index) => {
                    const percentage = ((item.ventas / 614000) * 100).toFixed(1);
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.month}</td>
                        <td className="py-3 px-4 text-right">S/ {item.ventas.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{percentage}%</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/50 font-medium">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4 text-right">S/ 614,000</td>
                    <td className="py-3 px-4 text-right">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesReportPage;
