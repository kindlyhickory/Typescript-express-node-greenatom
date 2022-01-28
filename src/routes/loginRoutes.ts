import { Request, Router, Response, request, NextFunction } from "express";

interface RequestWithBody extends Request {
    body: {[key: string]: string | undefined}
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.loggedIn) {
        next();
        return
    }
    res.status(403);
    res.send('Access denied');
}

const router = Router();

router.get('/login', (req: Request, res: Response) => {
    res.send(`
    <form method="POST">
        <div>
            <label>Email</label>
            <input name="email"/>
        </div>
        <div>
            <label>Password</label>
            <input name="password" type="password"/>
        </div>
        <button>Submit</button>
    </form>
    `)    
});

router.post('/login', (req: RequestWithBody, res: Response) => {
    const {email, password} = req.body;
    if (email && password && email === 'myemail@gmail.com' && password === "password"){
        req.session = { loggedIn: true };
        res.redirect('/')
    } else {
        res.send("invalid email or password");
    }
})

router.get('/todos', (req:RequestWithBody, res: Response) => {
    if ( req.session && req.session.loggedIn) {
        res.send(`
        <form method="POST">
            <div>
                <label>What ToDo you want to add</label>
                <input required name="todo"/>
                <button>Submit</button>
            </div>
        </form>
        <div><a href="/">To main page</div>
    `)
    } else {
        res.send(`
        <div>
            <div>You are not logged in. You should log in to add ToDo</div>
            <a href="/login">Login</a>
        </div>
        `);
    }
});

router.post('/todos', (req:RequestWithBody, res: Response)=> {
    const {todo} = req.body
    res.send(`
        <div>
            <p>Your todo ${todo}</p>
        </div>
    `)
})

router.get('/', (req: Request, res: Response) => {
    // req.session
    if ( req.session && req.session.loggedIn) {
        res.send(`
        <div>
            <div>You are logged in </div>
            <a href="/logout">Logout</a>
            <a href="/todos">Add ToDo</a>
        </div>
        `);
    } else {
        res.send(`
        <div>
            <div>You are not logged in</div>
            <a href="/login">Login</a>
        </div>
        `);
    }
});

router.get('/logout', (req: Request, res: Response) => {
    req.session = undefined;
    res.redirect('/');
})

router.get('/protected', requireAuth, (req: Request, res: Response) => {
    res.send('Welcome to protected route, logged in user');
})

export {router};