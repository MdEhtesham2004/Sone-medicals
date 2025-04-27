from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.signals  # 👈 This line is essential


        # This will ensure that the signals are imported and ready to use when the app is loaded.
        # You can also import other modules or perform other startup tasks here if needed.
