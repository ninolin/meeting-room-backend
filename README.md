# README

### 資料庫

資料庫使用 sequelize ORM 來操作 MySQL，使用前需要先安裝

```
npm install mysql2 sequelize sequelize-cli
```

#### 初始化

使用下面指令初始化後，會產生一個設定檔和三個資料夾

| 資料夾/檔案        | 功能                 |
| ------------------ | :------------------- |
| config/config.json | 設定資料庫的連線方式 |
| migrations         | 產生 table 的程式    |
| models             | table 的資料格式     |
| seeders            | 產生假資料的程式     |

#### 切換環境

```
export NODE_ENV=test   # 切換到測試環境，在config.json中設定各種環境的連線方式
echo $NODE_ENV         # 印出目前使用的環境
```

#### 新加 table

使用下面指令新加 table，執行會自動產生 models 和 migrations

```
npx sequelize model:generate --name <TABLE NAME> --attributes <COLUMN NAME>:<COLUMN TYPE>,<COLUMN NAME>:<COLUMN TYPE>
npx sequelize model:generate --name user_group --attributes name:string,description:text
```

執行 migrations 會自動在資料庫中產生 table

```
npx sequelize db:migrate
```
