import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources
const resources = {
  en: {
    translation: {
      // Common terms
      "welcome": "Welcome",
      "dashboard": "Dashboard",
      "shipments": "Shipments",
      "drivers": "Drivers",
      "routes": "Routes",
      "sla_monitoring": "SLA Monitoring",
      "admin": "Admin",
      "settings": "Settings",
      "logout": "Logout",
      "reconciliation": "Reconciliation",
      "analytics": "Analytics",
      
      // Dashboard specific
      "dispatcher_dashboard": "Dispatcher Dashboard",
      "manage_delivery_operations": "Manage your delivery operations with real-time tracking and insights",
      "active_shipments": "Active Shipments",
      "active_drivers": "Active Drivers",
      "on_time_rate": "On-Time Rate",
      "avg_delivery_time": "Avg. Delivery Time",
      "recent_activity": "Recent Activity",
      "quick_actions": "Quick Actions",
      "create_shipment": "Create Shipment",
      "add_driver": "Add Driver",
      "optimize_routes": "Optimize Routes",
      "system_settings": "System Settings",
      "currently_in_transit": "Currently in transit",
      "currently_on_duty": "Currently on duty",
      "deliveries_on_schedule": "Deliveries on schedule",
      "average_time_per_delivery": "Average time per delivery",
      
      // Shipments
      "shipment_list": "Shipment List",
      "search_shipments": "Search shipments...",
      "tracking_number": "Tracking Number",
      "status": "Status",
      "driver": "Driver",
      "destination": "Destination",
      "estimated_delivery": "Estimated Delivery",
      "actions": "Actions",
      "view_details": "View Details",
      "update_status": "Update Status",
      "shipment_management": "Shipment Management",
      "add_shipment": "Add Shipment",
      "edit_shipment": "Edit Shipment",
      "add_new_shipment": "Add New Shipment",
      "origin": "Origin",
      "assigned_driver": "Assigned Driver",
      "address": "Address",
      "latitude": "Latitude",
      "longitude": "Longitude",
      
      // Shipment statuses
      "shipment_status_pending": "Pending",
      "shipment_status_assigned": "Assigned",
      "shipment_status_in_transit": "In Transit",
      "shipment_status_delivered": "Delivered",
      "shipment_status_failed": "Failed",
      
      // Drivers
      "driver_list": "Driver List",
      "driver_name": "Driver Name",
      "phone": "Phone",
      "current_location": "Current Location",
      "assigned_shipments": "Assigned Shipments",
      "status_online": "Online",
      "status_offline": "Offline",
      "status_busy": "Busy",
      "driver_management": "Driver Management",
      "edit_driver": "Edit Driver",
      "add_new_driver": "Add New Driver",
      "vehicle": "Vehicle",
      "location": "Location",
      "vehicle_type": "Vehicle Type",
      
      // Driver statuses
      "driver_status_available": "Available",
      "driver_status_busy": "Busy",
      "driver_status_offline": "Offline",
      
      // Vehicle types
      "vehicle_type_bike": "Bike",
      "vehicle_type_car": "Car",
      "vehicle_type_van": "Van",
      
      // Routes
      "route_list": "Route List",
      "route_name": "Route Name",
      "assigned_driver": "Assigned Driver",
      "stops": "Stops",
      "distance": "Distance",
      "estimated_time": "Estimated Time",
      "optimize": "Optimize",
      
      // Admin
      "admin_interface": "Admin Interface",
      
      // SLA Monitoring
      "sla_monitoring_dashboard": "SLA Monitoring Dashboard",
      
      // Generic
      "loading": "Loading...",
      "no_data": "No data available",
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "view": "View",
      "create": "Create",
      "update": "Update",
      "name": "Name"
    }
  },
  ar: {
    translation: {
      // Common terms
      "welcome": "مرحبا",
      "dashboard": "لوحة التحكم",
      "shipments": "الشحنات",
      "drivers": "السائقين",
      "routes": "الطرق",
      "sla_monitoring": "مراقبة SLA",
      "admin": "الإدارة",
      "settings": "الإعدادات",
      "logout": "تسجيل الخروج",
      "reconciliation": "التسوية",
      "analytics": "التحليلات",
      
      // Dashboard specific
      "dispatcher_dashboard": "لوحة تحكم المرسل",
      "manage_delivery_operations": "إدارة عمليات التوصيل الخاصة بك مع التتبع في الوقت الفعلي والرؤى",
      "active_shipments": "الشحنات النشطة",
      "active_drivers": "السائقين النشطين",
      "on_time_rate": "معدل التوقيت",
      "avg_delivery_time": "متوسط وقت التسليم",
      "recent_activity": "النشاط الأخير",
      "quick_actions": "إجراءات سريعة",
      "create_shipment": "إنشاء شحنة",
      "add_driver": "إضافة سائق",
      "optimize_routes": "تحسين المسارات",
      "system_settings": "إعدادات النظام",
      "currently_in_transit": "قيد التوصيل حالياً",
      "currently_on_duty": "في الخدمة حالياً",
      "deliveries_on_schedule": "التسليم في الموعد المحدد",
      "average_time_per_delivery": "متوسط وقت التسليم",
      
      // Shipments
      "shipment_list": "قائمة الشحنات",
      "search_shipments": "البحث في الشحنات...",
      "tracking_number": "رقم التتبع",
      "status": "الحالة",
      "driver": "السائق",
      "destination": "الوجهة",
      "estimated_delivery": "التسليم المقدر",
      "actions": "الإجراءات",
      "view_details": "عرض التفاصيل",
      "update_status": "تحديث الحالة",
      "shipment_management": "إدارة الشحنات",
      "add_shipment": "إضافة شحنة",
      "edit_shipment": "تعديل الشحنة",
      "add_new_shipment": "إضافة شحنة جديدة",
      "origin": "المصدر",
      "assigned_driver": "السائق المخصص",
      "address": "العنوان",
      "latitude": "خط العرض",
      "longitude": "خط الطول",
      
      // Shipment statuses
      "shipment_status_pending": "قيد الانتظار",
      "shipment_status_assigned": "مخصص",
      "shipment_status_in_transit": "قيد التوصيل",
      "shipment_status_delivered": "تم التسليم",
      "shipment_status_failed": "فشل",
      
      // Drivers
      "driver_list": "قائمة السائقين",
      "driver_name": "اسم السائق",
      "phone": "الهاتف",
      "current_location": "الموقع الحالي",
      "assigned_shipments": "الشحنات المخصصة",
      "status_online": "متصل",
      "status_offline": "غير متصل",
      "status_busy": "مشغول",
      "driver_management": "إدارة السائقين",
      "edit_driver": "تعديل السائق",
      "add_new_driver": "إضافة سائق جديد",
      "vehicle": "المركبة",
      "location": "الموقع",
      "vehicle_type": "نوع المركبة",
      
      // Driver statuses
      "driver_status_available": "متاح",
      "driver_status_busy": "مشغول",
      "driver_status_offline": "غير متصل",
      
      // Vehicle types
      "vehicle_type_bike": "دراجة نارية",
      "vehicle_type_car": "سيارة",
      "vehicle_type_van": "شاحنة صغيرة",
      
      // Routes
      "route_list": "قائمة المسارات",
      "route_name": "اسم المسار",
      "assigned_driver": "السائق المخصص",
      "stops": "المحطات",
      "distance": "المسافة",
      "estimated_time": "الوقت المقدر",
      "optimize": "تحسين",
      
      // Admin
      "admin_interface": "واجهة الإدارة",
      
      // SLA Monitoring
      "sla_monitoring_dashboard": "لوحة مراقبة SLA",
      
      // Generic
      "loading": "جار التحميل...",
      "no_data": "لا توجد بيانات متاحة",
      "save": "حفظ",
      "cancel": "إلغاء",
      "delete": "حذف",
      "edit": "تعديل",
      "view": "عرض",
      "create": "إنشاء",
      "update": "تحديث",
      "name": "الاسم"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;