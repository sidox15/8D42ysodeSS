// تعريف المعرف المسموح
const allowedIdentifier = "19982015"; // استبدل هذا بقيمة المعرف الصحيح

// الحصول على المعرف المدخل من المستخدم
const userIdentifier = prompt("من فضلك أدخل كلمة سر:");

// التحقق من المعرف
if (userIdentifier === allowedIdentifier) {
    // إذا كان المعرف صحيح، يمكن أن يتم تنفيذ الأكواد هنا
    console.log("المعرف صحيح. مرحبًا بك!");
} else {
    // إذا كان المعرف غير صحيح، يتم التوجيه إلى الموقع الرئيسي
    window.location.href = "https://ayoussam.com"; // استبدل هذا برابط الموقع الرئيسي للقالب
}
