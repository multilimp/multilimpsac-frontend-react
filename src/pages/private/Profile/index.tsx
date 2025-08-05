import React from 'react';
import './Profile.css';
import { RolesEnum } from '@/services/users/user.enum';
import { 
  Email, 
  Phone, 
  LocationOn, 
  Work, 
  Security,
  VerifiedUser,
} from '@mui/icons-material';
import { 
  Box, 
  Typography, 
  Chip, 
  Avatar, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

export interface UserProps {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  role: RolesEnum;
  foto?: string;
  estado: boolean;
  telefono?: string;
  departamento?: string;
  fechaIngreso?: string;
  ultimoAcceso?: string;
  permisos?: string[];
  ubicacion?: string;
}

interface ProfileProps {
  user?: UserProps;
}

const defaultUser: UserProps = {
  id: 1001,
  nombre: 'Harold Medrano',
  email: 'harold.medrano@multilimpsac.com',
  role: RolesEnum.ADMIN,
  estado: true,
  foto: 'https://i.pravatar.cc/men/150?img=32',
  telefono: '+51 999 123 456',
  departamento: 'Sistemas y Tecnología',
  fechaIngreso: '15 de Marzo, 2023',
  ultimoAcceso: 'Hace 2 horas',
  permisos: ['Administrador', 'Gestión de usuarios', 'Reportes avanzados', 'Configuración del sistema'],
  ubicacion: 'Lima, Perú'
};

const Profile: React.FC<ProfileProps> = ({ user = defaultUser }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" fontWeight={700} mb={3}>
      Perfil de Usuario
    </Typography>

    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      {/* Tarjeta de información principal */}
      <Box sx={{ width: { xs: '100%', md: '33%' } }}>
        <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              p: 3,
              textAlign: 'center',
              color: 'white'
            }}
          >
            <Avatar
              src={user.foto}
              alt={user.nombre}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                border: '4px solid rgba(255,255,255,0.3)'
              }}
            />
            <Typography variant="h5" fontWeight={600} mb={1}>
              {user.nombre}
            </Typography>
            <Chip
              label={user.role === RolesEnum.ADMIN ? 'Administrador' : 'Usuario'}
              color={user.role === RolesEnum.ADMIN ? 'warning' : 'primary'}
              variant="filled"
              sx={{ mb: 1 }}
            />
            <Chip
              label={user.estado ? 'Activo' : 'Inactivo'}
              color={user.estado ? 'success' : 'error'}
              variant="filled"
              size="small"
            />
          </Box>
          
          <CardContent>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Email color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={user.email}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              
              {user.telefono && (
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Teléfono" 
                    secondary={user.telefono}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              )}
              
              {user.ubicacion && (
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Ubicación" 
                    secondary={user.ubicacion}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              )}
              
              {user.departamento && (
                <ListItem>
                  <ListItemIcon>
                    <Work color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Departamento" 
                    secondary={user.departamento}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Tarjeta de detalles del perfil */}
      <Box sx={{ flex: 1 }}>
        <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Información del Perfil
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: '48%' }, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID de Usuario
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  #{user.id}
                </Typography>
              </Box>
              
              <Box sx={{ width: { xs: '100%', sm: '48%' }, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Estado de la Cuenta
                </Typography>
                <Chip
                  label={user.estado ? 'Activo' : 'Inactivo'}
                  color={user.estado ? 'success' : 'error'}
                  size="small"
                  icon={user.estado ? <VerifiedUser /> : <Security />}
                />
              </Box>
              
              {user.fechaIngreso && (
                <Box sx={{ width: { xs: '100%', sm: '48%' }, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fecha de Ingreso
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.fechaIngreso}
                  </Typography>
                </Box>
              )}
              
              {user.ultimoAcceso && (
                <Box sx={{ width: { xs: '100%', sm: '48%' }, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Último Acceso
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.ultimoAcceso}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Tarjeta de permisos */}
        {user.permisos && user.permisos.length > 0 && (
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Permisos y Roles
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.permisos.map((permiso, index) => (
                  <Chip
                    key={index}
                    label={permiso}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>

    {/* Sección de mantenimiento */}
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Funcionalidades en Desarrollo
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
          <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Configuración de Notificaciones
              <br />
              <Chip label="Próximamente" size="small" color="warning" sx={{ mt: 1 }} />
            </Typography>
          </Card>
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
          <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Historial de Actividad
              <br />
              <Chip label="Próximamente" size="small" color="warning" sx={{ mt: 1 }} />
            </Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default Profile;
