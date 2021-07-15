import React from 'react';
import MainGrid from '../src/components/MainGrid/'
import Box from '../src/components/Box/'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations/'

function ProfileSidebar(propriedades) {
  return (
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.gitHubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.gitHubUser}`}>
          @{propriedades.gitHubUser}
        </a>
      </p>
      <hr/>

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{propriedades.title} ({propriedades.items.length})</h2>
      <ul>
        {propriedades.items.map((item) => {
          return (
            <li key={item.id}>
              <a href={`https://github.com/${item.login}`}>
                <img src={`https://github.com/${item.login}.png`} />
                <span>{item.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  // user logado
  const githubUser = 'igorbartmann';

  // seguidores (faz uma reques para o GitHub)
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function() {
    fetch('https://api.github.com/users/igorbartmann/followers')
    .then((respostaDoServidor) => {
      return respostaDoServidor.json();
    })
    .then((respostaCompletaJson) => {
      setSeguidores(respostaCompletaJson);
    })
  }, [])

  // Comunidade (inicía com uma comunidade padrão pré-configurada)
  const comunidadePadrao = {
    id: '1',
    title: 'Eu odeio acordar cedo',
    urlImage: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
  }

  const [comunidades, setComunidades] = React.useState([comunidadePadrao]);

  // Pessoas da comunidade
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar gitHubUser={githubUser}/>
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>     

            <form onSubmit={function handleCreateCommunity(event) {
              event.preventDefault();

              var dadosForm = new FormData(event.target);
              var nomeComunidade = dadosForm.get('title');
              var urlImagemComunidade = dadosForm.get('image');

              const novaComunidade = {
                id: new Date().toISOString(),
                title: nomeComunidade,
                urlImage: urlImagemComunidade
              }

              var comunidadesAtualizadas = [...comunidades, novaComunidade];
              setComunidades(comunidadesAtualizadas);
            }}>
              <div>
                <input
                  type="text"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  placeholder="Qual vai ser o nome da sua comunidade?"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa."
                  placeholder="Coloque uma URL para usarmos de capa."
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores}/>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Pessoas da Comunidade ({pessoasFavoritas.length})</h2>
            <ul>
              {pessoasFavoritas.map((item) => {
                return (
                  <li key={item}>
                    <a href={`/users/${item}`}>
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`/users/${item.title}`}>
                      <img src={item.urlImage} />
                      <span>{item.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
