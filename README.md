# molkkyprime
molkkyprime.com

## gcp cliのプロファイル切り替え

コンフィグの確認

```
gcloud config configurations list

NAME         IS_ACTIVE  ACCOUNT                             PROJECT         COMPUTE_DEFAULT_ZONE  COMPUTE_DEFAULT_REGION
default      False      molkky.event.calendar.jp@gmail.com  molkkycalendar
molkkyprime  True       molkky.kanto.league@gmail.com
```

切り替え

```
# 切り替え
gcloud config configurations activate {your-configurations}

# 新たにconfigurationsを作成
gcloud config configurations create your-configurations
Created [your-configurations].
Activated [your-configurations].

# googleにログイン
gcloud auth login

# プロジェクトの指定
gcloud config set project molkkyprime
```

CORSエラーの対処コマンド（設定ファイルは各プロジェクトに配置）

```
gsutil cors set {設定ファイルを指定、通常はcors-config.json} gs://<bucket-name>
```

