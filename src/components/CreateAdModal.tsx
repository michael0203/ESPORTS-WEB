import * as Dialog                                      from '@radix-ui/react-dialog';
import * as Checkbox                                    from '@radix-ui/react-checkbox';
import * as ToggleGroup                                 from '@radix-ui/react-toggle-group';
import { Input }                                        from '../Form/input';
import { Check, GameController, MagnifyingGlassPlus }   from 'phosphor-react';
import { useState, useEffect, FormEvent }               from 'react';
import axios from 'axios';
import 'keen-slider/keen-slider.min.css'
import { LOGIN } from './Login'

import { useKeenSlider } from 'keen-slider/react' // import from 'keen-slider/react.es' for to get an ES module

interface Game {
 
    id:     string;
    title:  string;
    banner: string;
  }

export function CreateAdModal(){

    const [games, setGames] = useState <Game[]>([])
    const [weekDays, setWeekDays] = useState<string[]>([])
    const [useVoiceChannel, setUseVoiceChannel] = useState(false)

    const [topGames, setTopGames] = useState <Game[]>([])

    useEffect(() => {
      fetch(`https://api.twitch.tv/helix/games/top?first=100`,{
        method: 'get',
        headers:{
          'Authorization': `Bearer ${LOGIN.token}`,
          'Client-Id': `${LOGIN.id_client}`
        }
      })

        .then((response) => response.json())
        .then((data) => {
          let listTopGame = [];
          for(var key in data.data){
            listTopGame.push({
              id: data.data[key].id,
              title: data.data[key].name,
              banner: data.data[key].box_art_url,
            })
          }
          setTopGames(listTopGame);
        });
    }, []);

    useEffect(() => {
      axios('http://localhost:3333/games').then(response => { 
        setGames(response.data)
      })
    }, [])

    async function handleCreateAd(event:FormEvent){
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        
        let gameSelected = topGames.find(item => item.id === data.game);
        let tem = games.find(item => item.id === data.game);

        try{
          if (tem?.id != data.game){
            await   axios.post(`http://localhost:3333/create/game`,{
              id: gameSelected?.id,
              title: gameSelected?.title,
              banner: gameSelected?.banner.replace('{width}' ,'213').replace('{height}','285')
              
            })
          }

        } catch(err){
          console.log(err);
          alert('Erro ao cadastrar game!')
        }

        try {

          await   axios.post(`http://localhost:3333/game/${data.game}/ads`,{
                  name: data.name,
                  yearsPlaying: Number(data.yearsPlaying),
                  discord: data.discord,
                  weekDays: weekDays.map(Number),
                  hourStart: data.hourStart,
                  hourEnd: data.hourEnd,
                  useVoiceChannel: useVoiceChannel

            })
            
            alert('Anúncio criado com sucesso!')
        } catch (err){
            console.log(err);
            alert('Erro ao criar anúncio!')
        }
    }

    return(
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>

            <Dialog.Content className='fixed bg-[#2A2634] py-8 PX-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-md shadow-black/25'>
              <Dialog.Title className='text-3xl font-black px-4'>Publique um anúncio</Dialog.Title>

                <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4  px-4' >
                  <div className='flex flex-col gap-2'>
                    <label htmlFor='game' className='font-semibold'> Qual o game?</label>
                    <select
                        name='game'
                        id='game' 
                        required
                        className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none'
                        defaultValue=""> 
                        <option  disabled value={""}> Selecione o game que deseja jogar!</option>
                        { topGames.map(game => {
                        return(
                            <option key={game.id} value={game.id}> {game.title} </option>
                        )
                      })}
                      </select>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <label htmlFor=''> Seu nome (ou nickname)</label>
                    <Input required minLength={1} name='name' id="name" placeholder='Como te chamam dentro do game?'/>
                  </div>

                  <div className='grid grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='yearsPlaying'> Joga há quantos anos?</label>
                      <Input required min={0} name='yearsPlaying' id='yearsPlaying' type="number" placeholder="Tudo bem ser ZERO"/>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='discord'>Qual é seu Discord?</label>
                      <Input required minLength={4} name='discord' id='discord' placeholder='Usuario#000'/>
                    </div>
                  </div>

                  <div className='flex gap-6'>
                    <div  
                    className='flex flex-col gap-2'>
                      <label htmlFor='weekDays'>Quando costuma jogar?</label>
                      
                        <ToggleGroup.Root 
                        type="multiple" 
                        className='grid grid-cols-4 gap-2'
                        value={weekDays}
                        onValueChange={setWeekDays}>
                            <ToggleGroup.Item
                            value='0'
                            title='Domingo'
                            className={`w-8 h-8 rounded  ${weekDays.includes('0') ? ' bg-violet-500' : 'bg-zinc-900'}`}  >D</ToggleGroup.Item>

                            <ToggleGroup.Item
                            value='1'
                            title='Segunda'
                            className={`w-8 h-8 rounded  ${weekDays.includes('1') ? ' bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>

                            <ToggleGroup.Item
                            value='2'
                            title='Terça'  
                            className={`w-8 h-8 rounded  ${weekDays.includes('2') ? ' bg-violet-500' : 'bg-zinc-900'}`}>T</ToggleGroup.Item>
                        
                            <ToggleGroup.Item
                            value='3'
                            title='Quarta' 
                            className={`w-8 h-8 rounded  ${weekDays.includes('3') ? ' bg-violet-500' : 'bg-zinc-900'}`}>Q</ToggleGroup.Item>              
                        
                            <ToggleGroup.Item
                            value='4'
                            title='Quinta' 
                            className={`w-8 h-8 rounded  ${weekDays.includes('4') ? ' bg-violet-500' : 'bg-zinc-900'}`}>Q</ToggleGroup.Item>

                            <ToggleGroup.Item
                            value='5'
                            title='Sexta'  
                            className={`w-8 h-8 rounded  ${weekDays.includes('5') ? ' bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
                        
                            <ToggleGroup.Item
                            value='6'
                            title='Sabado' 
                            className={`w-8 h-8 rounded  ${weekDays.includes('6') ? ' bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
                        </ToggleGroup.Root>
                    </div>

                    <div className='flex flex-col gap-2 flex-1'>
                      <label htmlFor='hourStart'>Qual o horário do dia?</label>
                        <div className=' grid grid-cols-2 gap-2'>
                          <Input required name='hourStart' id='hourStart' type="time"  placeholder='De'></Input>
                          <Input required name='hourEnd'   id='hourEnd'   type="time" placeholder='Até'></Input>
                        </div>
                      </div>
                    </div>

                  <label className='mt-2 flex items-center gap-2 text-sm'>
                    <Checkbox.Root
                        checked={useVoiceChannel}
                        onCheckedChange={(checked) => {
                            setUseVoiceChannel(false)
                            if (checked === true){
                                setUseVoiceChannel(true)  
                            }
                        }}
                        className='w-6 h-6 p-1 rounded bg-zinc-900'>
                        <Checkbox.Indicator>
                            <Check className='w-4 h-4 text-emerald-400'/>
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                    Costumo me conecar ao chat de voz?
                  </label>

                  <footer className='mt-4 flex justify-end gap-4'>

                    <Dialog.Close className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
                    title=''>Cancelar</Dialog.Close>

                  <button 
                    className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600' 
                    type='submit'
                    > <GameController className='w-6 h-6'/>
                      Encontar duo</button>
                  </footer>
                </form>
            </Dialog.Content>
          </Dialog.Portal>
    )
   
}