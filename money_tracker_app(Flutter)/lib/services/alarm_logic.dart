import '../services/notification_service.dart';

void scheduleAlarm(
    {required String title, required DateTime scheduledDate}) {
  NotificationService.showNotification(
    id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
    title: title,
    body: 'Transaction reminder',
    scheduledDate: scheduledDate,
  );
}
