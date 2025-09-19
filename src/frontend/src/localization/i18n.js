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
      
      // Drivers
      "driver_list": "Driver List",
      "driver_name": "Driver Name",
      "phone": "Phone",
      "current_location": "Current Location",
      "assigned_shipments": "Assigned Shipments",
      "status_online": "Online",
      "status_offline": "Offline",
      "status_busy": "Busy",
      
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
      "view": "View"
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
      
      // Drivers
      "driver_list": "قائمة السائقين",
      "driver_name": "اسم السائق",
      "phone": "الهاتف",
      "current_location": "الموقع الحالي",
      "assigned_shipments": "الشحنات المخصصة",
      "status_online": "متصل",
      "status_offline": "غير متصل",
      "status_busy": "مشغول",
      
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
      "view": "عرض"
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