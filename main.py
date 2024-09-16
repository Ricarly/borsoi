import os
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'projeto-borsoi')
app.config['STATIC_FOLDER'] = 'static'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3')
if app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_default = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    try:
        return User.query.get(int(user_id))
    except ValueError:
        return User.query.filter_by(username=user_id).first()

class ConteudoHome(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    subtitulo = db.Column(db.String(200), nullable=False)
    paragrafo = db.Column(db.Text, nullable=False)
    texto_botao_fale_conosco = db.Column(db.String(100), nullable=False, default="Clique aqui e fale conosco")

@app.route('/')
def index():
    return redirect(url_for('home'))

@app.route('/home')
def home():
    conteudo_home = ConteudoHome.query.first()
    return render_template('home.html', conteudo_home=conteudo_home)

@app.route('/contato')
def contato():
    return render_template('contato.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            session['user_id'] = user.id  # Armazena o ID do usuário na sessão
            if user.is_default:
                return redirect(url_for('change_credentials'))
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Usuário ou senha inválidos')
    return render_template('login.html')

@app.route('/change_credentials', methods=['GET', 'POST'])
@login_required
def change_credentials():
    if request.method == 'POST':
        new_username = request.form['new_username']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        if new_password != confirm_password:
            flash('As senhas não coincidem')
            return render_template('change_credentials.html')

        if User.query.filter_by(username=new_username).first() and new_username != current_user.username:
            flash('Nome de usuário já existe')
            return render_template('change_credentials.html')

        current_user.username = new_username
        current_user.set_password(new_password)
        current_user.is_default = False
        db.session.commit()

        flash('Credenciais atualizadas com sucesso')
        return redirect(url_for('admin_dashboard'))

    return render_template('change_credentials.html')

@app.route('/admin_dashboard', methods=['GET', 'POST'])
@login_required
def admin_dashboard():
    conteudo_home = ConteudoHome.query.first()
    if request.method == 'POST':
        conteudo_home.titulo = request.form['titulo']
        conteudo_home.subtitulo = request.form['subtitulo']
        conteudo_home.paragrafo = request.form['paragrafo']
        conteudo_home.texto_botao_fale_conosco = request.form['texto_botao_fale_conosco']
        db.session.commit()
        flash('Conteúdo atualizado com sucesso!', 'success')
        return redirect(url_for('admin_dashboard'))
    return render_template('admin_dashboard.html', conteudo_home=conteudo_home)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/atualizar_home', methods=['POST'])
@login_required
def atualizar_home():
    conteudo_home = ConteudoHome.query.first()
    if not conteudo_home:
        conteudo_home = ConteudoHome()
    
    conteudo_home.titulo = request.form['titulo']
    conteudo_home.subtitulo = request.form['subtitulo']
    conteudo_home.paragrafo = request.form['paragrafo']
    
    db.session.add(conteudo_home)
    db.session.commit()
    
    flash('Página inicial atualizada com sucesso')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin')
@login_required
def admin_redirect():
    return redirect(url_for('admin_dashboard'))


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Criar usuário padrão se não existir
        if not User.query.filter_by(username='admin').first():
            default_user = User(username='admin')
            default_user.set_password('senha123')
            db.session.add(default_user)
            db.session.commit()
        
        # Criar conteúdo inicial da página home se não existir
        conteudo_home = ConteudoHome.query.first()
        if not conteudo_home:
            conteudo_inicial = ConteudoHome(
                titulo="TROQUE",
                subtitulo="SEU GÁS",
                paragrafo="E GANHE UM BRINDE ESPECIAL",
                texto_botao_fale_conosco="Clique aqui e fale conosco"
            )
            db.session.add(conteudo_inicial)
            db.session.commit()
        else:
            # Adicionar a nova coluna se ela não existir
            if not hasattr(conteudo_home, 'texto_botao_fale_conosco'):
                with db.engine.connect() as conn:
                    conn.execute(text("ALTER TABLE conteudo_home ADD COLUMN texto_botao_fale_conosco VARCHAR(100) NOT NULL DEFAULT 'Clique aqui e fale conosco'"))
                db.session.commit()
    
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

