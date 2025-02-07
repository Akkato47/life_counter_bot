CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_telegram_id" integer NOT NULL,
	"chat_id" integer NOT NULL,
	"username" text NOT NULL,
	"weeks_lived" text,
	"monthes_lived" text,
	"birth_date" timestamp NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date NOT NULL,
	CONSTRAINT "users_user_telegram_id_unique" UNIQUE("user_telegram_id"),
	CONSTRAINT "users_chat_id_unique" UNIQUE("chat_id")
);
