from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_doctorprofile_bmdc_no_doctorprofile_is_verified'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='user',
            field=models.OneToOneField(
                to='core.User',
                on_delete=django.db.models.deletion.CASCADE,
                related_name='patient_profile',
                null=True,
                blank=True
            ),
        ),
    ]
