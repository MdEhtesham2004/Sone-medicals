import os
import pandas as pd
from django.apps import apps
from django.conf import settings

def backup_to_excel():
    backup_dir = os.path.join(settings.BASE_DIR, 'backups')
    os.makedirs(backup_dir, exist_ok=True)
    backup_file = os.path.join(backup_dir, 'mysql_full_backup.xlsx')

    with pd.ExcelWriter(backup_file, engine='openpyxl') as writer:
        app_models = apps.get_models()

        for model in app_models:
            model_name = model.__name__
            queryset = model.objects.all()
            values = list(queryset.values())

            if values:
                df = pd.DataFrame(values)
            else:
                df = pd.DataFrame(columns=[field.name for field in model._meta.fields])

            df = make_timezone_naive(df)
            sheet_name = model_name[:31]
            df.to_excel(writer, sheet_name=sheet_name, index=False)

    return backup_file

def make_timezone_naive(df):
    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = df[col].apply(lambda x: x.replace(tzinfo=None) if pd.notnull(x) else x)
    return df



