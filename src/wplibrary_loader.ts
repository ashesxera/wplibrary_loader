/**************************************
Author: Ashes
License: MIT License
Create Date: 2021-11-26
***************************************/

import PotDb from 'PotDb'
import {ulid} from 'ulidx'
import fs from 'fs'
import path from 'path'

interface ITestDoc1 {
  id: string
  _id?: string
  title: string
  content: string
  type: string
  add_time_ms: number
  edit_time_ms: number
}

const dir = ".\\txt1";

// Make an async function that gets executed immediately
(async ()=>{
    // Our starting point
    try {
        // Get the files as an array
        const files = await fs.promises.readdir( dir );
        const db = new PotDb('db')

        // Loop them all with the new for...of
        for( const file of files ) {
           var data = fs.readFileSync(path.join( dir, file ), 'utf8')
            var list = data.split('◆')
            var children = list.slice(1)
            var clist = []
            for(const li of children) {
                var item = {
                        id: ulid().toLowerCase(),
                        type: 'doc',
                        title: li.split('\n')[0],
                        add_time_ms: Date.now(),
                        content: li,
                        edit_time_ms: Date.now()
                }
                var citem = {
                    id: item.id,
                    title: item.title,
                    rendered_title: item.title,
                    children: []
                }
                clist.push(citem)
                await db.collection.items.insert<ITestDoc1>(item);
                const result = db.collection.items.count()
                console.log(result)
            }
            var item = {
                    id: ulid().toLowerCase(),
                    type: 'doc',
                    title: list[0].split('\n')[0],
                    add_time_ms: Date.now(),
                    content: list[0],
                    edit_time_ms: Date.now()
            }
            var node = {
                id: item.id,
                title: item.title,
                children: clist,
                rendered_title: item.title,
                "icon":"folder",
                "is_collapsed": false
            }
            await db.collection.items.insert<ITestDoc1>(item);
            const result = db.collection.items.count()
            console.log(result)
            await db.list.doc_tree.push(node)
            //const tree = await db.list.doc_tree.all()
            //console.log(tree)
        } // End for...of
    }
    catch( e ) {
        // Catch anything bad that happens
        console.error( "We've thrown! Whoops!", e );
    }

})();